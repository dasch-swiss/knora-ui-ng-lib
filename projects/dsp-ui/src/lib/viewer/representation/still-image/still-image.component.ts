import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChange
} from '@angular/core';
import {
    Constants,
    Point2D,
    ReadGeomValue,
    ReadResource,
    ReadStillImageFileValue,
    RegionGeometry
} from '@dasch-swiss/dsp-js';

// This component needs the openseadragon library itself, as well as the openseadragon plugin openseadragon-svg-overlay
// Both libraries are installed via package.json, and loaded globally via the script tag in .angular-cli.json

// OpenSeadragon does not export itself as ES6/ECMA2015 module,
// it is loaded globally in scripts tag of angular-cli.json,
// we still need to declare the namespace to make TypeScript compiler happy.
declare let OpenSeadragon: any;

/**
 * Represents a region.
 * Contains a reference to the resource representing the region and its geometries.
 */

export class Region {

    /**
     *
     * @param regionResource a resource of type Region
     */
    constructor(readonly regionResource: ReadResource) {

    }

    /**
     * Get all geometry information belonging to this region.
     *
     */
    getGeometries() {
        return this.regionResource.properties[Constants.HasGeometry] as ReadGeomValue[];
    }
}

/**
 * Represents a geometry belonging to a specific region.
 */
export class GeometryForRegion {

    /**
     *
     * @param geometry the geometrical information.
     * @param region the region the geometry belongs to.
     */
    constructor(readonly geometry: RegionGeometry, readonly region: ReadResource) {
    }

}

/**
 * Represents an image including its regions.
 */
export class StillImageRepresentation {

    /**
     *
     * @param stillImageFileValue a [[ReadStillImageFileValue]] representing an image.
     * @param regions the regions belonging to the image.
     */
    constructor(readonly stillImageFileValue: ReadStillImageFileValue, readonly regions: Region[]) {

    }

}

/**
 * Collection of `SVGPolygonElement` for individual regions.
 */
interface PolygonsForRegion {

    [key: string]: SVGPolygonElement[];

}

@Component({
    selector: 'dsp-still-image',
    templateUrl: './still-image.component.html',
    styleUrls: ['./still-image.component.scss']
})
export class StillImageComponent implements OnChanges, OnDestroy {

    @Input() images: StillImageRepresentation[];
    @Input() imageCaption?: string;
    @Input() activateRegion?: string; // highlight a region

    @Output() regionClicked = new EventEmitter<string>();

    private _viewer;
    private _regions: PolygonsForRegion = {};

    constructor(private _elementRef: ElementRef) {
    }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        if (changes['images'] && changes['images'].isFirstChange()) {
            this._setupViewer();
        }
        if (changes['images']) {
            this._openImages();
            this._renderRegions();
            this._unhighlightAllRegions();
            if (this.activateRegion !== undefined) {
                this._highlightRegion(this.activateRegion);
            }
        } else if (changes['activateRegion']) {
            this._unhighlightAllRegions();
            if (this.activateRegion !== undefined) {
                this._highlightRegion(this.activateRegion);
            }
        }
    }

    ngOnDestroy() {
        if (this._viewer) {
            this._viewer.destroy();
            this._viewer = undefined;
        }
    }

    /**
     * Renders all ReadStillImageFileValues to be found in [[this.images]].
     * (Although this.images is a Angular Input property, the built-in change detection of Angular does not detect changes in complex objects or arrays, only reassignment of objects/arrays.
     * Use this method if additional ReadStillImageFileValues were added to this.images after creation/assignment of the this.images array.)
     */
    updateImages() {
        if (!this._viewer) {
            this._setupViewer();
        }
        this._openImages();
    }

    /**
     * Renders all regions to be found in [[this.images]].
     * (Although this.images is a Angular Input property, the built-in change detection of Angular does not detect changes in complex objects or arrays, only reassignment of objects/arrays.
     * Use this method if additional regions were added to the resources.images)
     */
    updateRegions() {
        if (!this._viewer) {
            this._setupViewer();
        }
        this._renderRegions();
    }

    /**
     * Highlights the polygon elements associated with the given region.
     *
     * @param regionIri the Iri of the region whose polygon elements should be highlighted..
     */
    private _highlightRegion(regionIri) {

        const activeRegion: SVGPolygonElement[] = this._regions[regionIri];

        if (activeRegion !== undefined) {
            for (const pol of activeRegion) {
                pol.setAttribute('class', 'roi-svgoverlay active');
            }
        }
    }

    /**
     * Unhighlights the polygon elements of all regions.
     *
     */
    private _unhighlightAllRegions() {

        for (const reg in this._regions) {
            if (this._regions.hasOwnProperty(reg)) {
                for (const pol of this._regions[reg]) {
                    pol.setAttribute('class', 'roi-svgoverlay');
                }
            }
        }
    }

    /**
     * Removes SVG overlays from the DOM.
     */
    private _removeOverlays() {

        for (const reg in this._regions) {
            if (this._regions.hasOwnProperty(reg)) {
                for (const pol of this._regions[reg]) {
                    if (pol instanceof SVGPolygonElement) {
                        pol.remove();
                    }
                }
            }
        }

        this._regions = {};

        // TODO: make this work by using osdviewer's addOverlay method
        this._viewer.clearOverlays();
    }

    /**
     * Initializes the OpenSeadragon _viewer
     */
    private _setupViewer(): void {
        const viewerContainer = this._elementRef.nativeElement.getElementsByClassName('osd-container')[0];
        const osdOptions = {
            element: viewerContainer,
            sequenceMode: false,
            showReferenceStrip: true,
            showNavigator: true,
            zoomInButton: 'DSP_OSD_ZOOM_IN',
            zoomOutButton: 'DSP_OSD_ZOOM_OUT',
            /*previousButton: 'DSP_OSD_PREV_PAGE',
            nextButton: 'DSP_OSD_NEXT_PAGE',*/
            homeButton: 'DSP_OSD_HOME',
            fullPageButton: 'DSP_OSD_FULL_PAGE'/*,
            rotateLeftButton: 'DSP_OSD_ROTATE_LEFT',        // doesn't work yet
            rotateRightButton: 'DSP_OSD_ROTATE_RIGHT'*/       // doesn't work yet
        };
        this._viewer = new OpenSeadragon.Viewer(osdOptions);

        this._viewer.addHandler('full-screen', (args) => {
            if (args.fullScreen) {
                viewerContainer.classList.add('fullscreen');
            } else {
                viewerContainer.classList.remove('fullscreen');
            }
        });
        this._viewer.addHandler('resize', (args) => {
            args.eventSource.svgOverlay().resize();
        });
    }

    /**
     * Adds all images in this.images to the _viewer.
     * Images are positioned in a horizontal row next to each other.
     */
    private _openImages(): void {
        // imageXOffset controls the x coordinate of the left side of each image in the OpenSeadragon viewport coordinate system.
        // The first image has its left side at x = 0, and all images are scaled to have a width of 1 in viewport coordinates.
        // see also: https://openseadragon.github.io/examples/viewport-coordinates/

        const fileValues: ReadStillImageFileValue[] = this.images.map(
            (img) => {
                return img.stillImageFileValue;
            });

        // display only the defined range of this.images
        const tileSources: object[] = this._prepareTileSourcesFromFileValues(fileValues);

        this._removeOverlays();
        this._viewer.open(tileSources);

    }

    /**
     * Prepare tile sources from the given sequence of [[ReadStillImageFileValue]].
     *
     * @param imagesToDisplay the given file values to de displayed.
     * @returns the tile sources to be passed to OSD _viewer.
     */
    private _prepareTileSourcesFromFileValues(imagesToDisplay: ReadStillImageFileValue[]): object[] {
        let imageXOffset = 0;
        const imageYOffset = 0;
        const tileSources = [];

        for (const image of imagesToDisplay) {
            const sipiBasePath = image.iiifBaseUrl + '/' + image.filename;
            const width = image.dimX;
            const height = image.dimY;

            // construct OpenSeadragon tileSources according to https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#open
            tileSources.push({
                // construct IIIF tileSource configuration according to
                // http://iiif.io/api/image/2.1/#technical-properties
                // see also http://iiif.io/api/image/2.0/#a-implementation-notes
                tileSource: {
                    '@context': 'http://iiif.io/api/image/2/context.json',
                    '@id': sipiBasePath,
                    height: height,
                    width: width,
                    profile: ['http://iiif.io/api/image/2/level2.json'],
                    protocol: 'http://iiif.io/api/image',
                    tiles: [{
                        scaleFactors: [1, 2, 4, 8, 16, 32],
                        width: 1024
                    }]
                },
                x: imageXOffset,
                y: imageYOffset
            });

            imageXOffset++;
        }

        return tileSources;
    }

    /**
     * Calculates the surface of a rectangular region.
     *
     * @param geom the region's geometry.
     * @returns the surface.
     */
    private _surfaceOfRectangularRegion(geom: RegionGeometry): number {

        if (geom.type !== 'rectangle') {
            console.log('expected rectangular region, but ' + geom.type + ' given');
            return 0;
        }

        const w = Math.max(geom.points[0].x, geom.points[1].x) - Math.min(geom.points[0].x, geom.points[1].x);
        const h = Math.max(geom.points[0].y, geom.points[1].y) - Math.min(geom.points[0].y, geom.points[1].y);

        return w * h;

    }

    /**
     * Adds a ROI-overlay to the viewer for every region of every image in this.images
     */
    private _renderRegions(): void {

        // TODO: get regions from @Input

        this._removeOverlays();

        let imageXOffset = 0; // see documentation in this.openImages() for the usage of imageXOffset

        for (const image of this.images) {
            const aspectRatio = (image.stillImageFileValue.dimY / image.stillImageFileValue.dimX);

            // collect all geometries belonging to this page
            const geometries: GeometryForRegion[] = [];
            image.regions.map((reg) => {

                this._regions[reg.regionResource.id] = [];
                const geoms = reg.getGeometries();

                geoms.map((geom) => {
                    const geomForReg = new GeometryForRegion(geom.geometry, reg.regionResource);

                    geometries.push(geomForReg);
                });
            });

            // sort all geometries belonging to this page
            geometries.sort((geom1, geom2) => {

                if (geom1.geometry.type === 'rectangle' && geom2.geometry.type === 'rectangle') {

                    const surf1 = this._surfaceOfRectangularRegion(geom1.geometry);
                    const surf2 = this._surfaceOfRectangularRegion(geom2.geometry);

                    // if reg1 is smaller than reg2, return 1
                    // reg1 then comes after reg2 and thus is rendered later
                    if (surf1 < surf2) {
                        return 1;
                    } else {
                        return -1;
                    }

                } else {
                    return 0;
                }

            });

            // render all geometries for this page
            for (const geom of geometries) {

                const geometry = geom.geometry;
                this._createSVGOverlay(geom.region.id, geometry, aspectRatio, imageXOffset, geom.region.label);

            }

            imageXOffset++;
        }

    }

    /**
     * Creates and adds a ROI-overlay to the viewer
     * @param regionIri the Iri of the region.
     * @param geometry - the geometry describing the ROI
     * @param aspectRatio -  the aspectRatio (h/w) of the image on which the geometry should be placed
     * @param xOffset -  the x-offset in Openseadragon viewport coordinates of the image on which the geometry should be placed
     * @param toolTip -  the tooltip which should be displayed on mousehover of the svg element
     */
    private _createSVGOverlay(regionIri: string, geometry: RegionGeometry, aspectRatio: number, xOffset: number, toolTip: string): void {
        const lineColor = geometry.lineColor;
        const lineWidth = geometry.lineWidth;

        let svgElement;
        switch (geometry.type) {
            case 'rectangle':
                svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');  // yes, we render rectangles as svg polygon elements
                this._addSVGAttributesRectangle(svgElement, geometry, aspectRatio, xOffset);
                break;
            case 'polygon':
                svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                this._addSVGAttributesPolygon(svgElement, geometry, aspectRatio, xOffset);
                break;
            case 'circle':
                svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                this._addSVGAttributesCircle(svgElement, geometry, aspectRatio, xOffset);
                break;
            default:
                console.log('ERROR: StillImageOSDViewerComponent.createSVGOverlay: unknown geometryType: ' + geometry.type);
                return;
        }
        svgElement.id = 'roi-svgoverlay-' + Math.random() * 10000;
        svgElement.setAttribute('class', 'roi-svgoverlay');
        svgElement.setAttribute('style', 'stroke: ' + lineColor + '; stroke-width: ' + lineWidth + 'px;');

        // event when a region is clicked (output)
        svgElement.addEventListener('click', () => {
            this.regionClicked.emit(regionIri);
        }, false);

        const svgTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        svgTitle.textContent = toolTip;

        const svgGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        svgGroup.appendChild(svgTitle);
        svgGroup.appendChild(svgElement);

        const overlay = this._viewer.svgOverlay();
        overlay.node().appendChild(svgGroup); // TODO: use method osdviewer's method addOverlay

        this._regions[regionIri].push(svgElement);
    }

    /**
     * Adds the necessary attributes to create a ROI-overlay of type 'rectangle' to a SVGElement
     * @param svgElement - an SVGElement (should have type 'polygon' (sic))
     * @param geometry - the geometry describing the rectangle
     * @param aspectRatio - the aspectRatio (h/w) of the image on which the circle should be placed
     * @param xOffset - the x-offset in Openseadragon viewport coordinates of the image on which the circle should be placed
     */
    private _addSVGAttributesRectangle(svgElement: SVGElement, geometry: RegionGeometry, aspectRatio: number, xOffset: number): void {
        const pointA = geometry.points[0];
        const pointB = geometry.points[1];

        // geometry.points contains two diagonally opposed corners of the rectangle, but the order of the corners is arbitrary.
        // We therefore construct the upperleft (UL), lowerright (LR), upperright (UR) and lowerleft (LL) positions of the corners with min and max operations.
        const positionUL = new Point2D(Math.min(pointA.x, pointB.x), Math.min(pointA.y, pointB.y));
        const positionLR = new Point2D(Math.max(pointA.x, pointB.x), Math.max(pointA.y, pointB.y));
        const positionUR = new Point2D(Math.max(pointA.x, pointB.x), Math.min(pointA.y, pointB.y));
        const positionLL = new Point2D(Math.min(pointA.x, pointB.x), Math.max(pointA.y, pointB.y));

        const points = [positionUL, positionUR, positionLR, positionLL];
        const viewCoordPoints = this._image2ViewPortCoords(points, aspectRatio, xOffset);
        const pointsString = this._createSVGPolygonPointsAttribute(viewCoordPoints);
        svgElement.setAttribute('points', pointsString);
    }

    /**
     * Adds the necessary attributes to create a ROI-overlay of type 'polygon' to a SVGElement
     * @param svgElement - an SVGElement (should have type 'polygon')
     * @param geometry - the geometry describing the polygon
     * @param aspectRatio - the aspectRatio (h/w) of the image on which the circle should be placed
     * @param xOffset - the x-offset in Openseadragon viewport coordinates of the image on which the circle should be placed
     */
    private _addSVGAttributesPolygon(svgElement: SVGElement, geometry: RegionGeometry, aspectRatio: number, xOffset: number): void {
        const viewCoordPoints = this._image2ViewPortCoords(geometry.points, aspectRatio, xOffset);
        const pointsString = this._createSVGPolygonPointsAttribute(viewCoordPoints);
        svgElement.setAttribute('points', pointsString);
    }

    /**
     * Adds the necessary attributes to create a ROI-overlay of type 'circle' to a SVGElement
     * @param svgElement - an SVGElement (should have type 'circle')
     * @param geometry - the geometry describing the circle
     * @param aspectRatio - the aspectRatio (h/w) of the image on which the circle should be placed
     * @param xOffset - the x-offset in Openseadragon viewport coordinates of the image on which the circle should be placed
     */
    private _addSVGAttributesCircle(svgElement: SVGElement, geometry: RegionGeometry, aspectRatio: number, xOffset: number): void {
        const viewCoordPoints = this._image2ViewPortCoords(geometry.points, aspectRatio, xOffset);
        const cx = String(viewCoordPoints[0].x);
        const cy = String(viewCoordPoints[0].y);
        // geometry.radius contains not the radius itself, but the coordinates of a (arbitrary) point on the circle.
        // We therefore have to calculate the length of the vector geometry.radius to get the actual radius. -> sqrt(x^2 + y^2)
        // Since geometry.radius has its y coordinate scaled to the height of the image,
        // we need to multiply it with the aspectRatio to get to the scale used by Openseadragon, analoguous to this.image2ViewPortCoords()
        const radius = String(Math.sqrt(geometry.radius.x * geometry.radius.x + aspectRatio * aspectRatio * geometry.radius.y * geometry.radius.y));
        svgElement.setAttribute('cx', cx);
        svgElement.setAttribute('cy', cy);
        svgElement.setAttribute('r', radius);
    }

    /**
     * Maps a Point2D[] with coordinates relative to an image to a new Point2D[] with coordinates in the viewport coordinate system of Openseadragon
     * see also: https://openseadragon.github.io/examples/viewport-coordinates/
     * @param points - an array of points in coordinate system relative to an image
     * @param aspectRatio - the aspectRatio (h/w) of the image
     * @param xOffset - the x-offset in viewport coordinates of the image
     * @returns - a new Point2D[] with coordinates in the viewport coordinate system of Openseadragon
     */
    private _image2ViewPortCoords(points: Point2D[], aspectRatio: number, xOffset: number): Point2D[] {
        return points.map((point) => {
            return new Point2D(point.x + xOffset, point.y * aspectRatio);
        });
    }

    /**
     * Returns a string in the format expected by the 'points' attribute of a SVGElement
     * @param points - an array of points to be serialized to a string
     * @returns - the points serialized to a string in the format expected by the 'points' attribute of a SVGElement
     */
    private _createSVGPolygonPointsAttribute(points: Point2D[]): string {
        let pointsString = '';
        for (const i in points) {
            if (points.hasOwnProperty(i)) {
                pointsString += points[i].x;
                pointsString += ',';
                pointsString += points[i].y;
                pointsString += ' ';
            }
        }
        return pointsString;
    }

}
