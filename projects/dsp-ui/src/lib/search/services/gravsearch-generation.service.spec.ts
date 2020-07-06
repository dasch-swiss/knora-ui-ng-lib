import { GravsearchGenerationService } from './gravsearch-generation.service';
import { ExtendedSearchParamsService } from './extended-search-params.service';
import { TestBed } from '@angular/core/testing';
import { MockOntology, ResourcePropertyDefinition } from '@dasch-swiss/dsp-js';
import {
    ComparisonOperatorAndValue,
    Equals, GreaterThan, GreaterThanEquals, IRI, LessThan, LessThanEquals, Like, Match, NotEquals,
    PropertyWithValue,
    ValueLiteral
} from '../advanced-search/select-property/specify-property-value/operator';


describe('GravsearchGenerationService', () => {
    let gravSearchGenerationServ: GravsearchGenerationService;
    let searchParamsServiceSpy: jasmine.SpyObj<ExtendedSearchParamsService>; // see https://angular.io/guide/testing#angular-testbed

    beforeEach(() => {
        const spy = jasmine.createSpyObj('SearchParamsService', ['changeSearchParamsMsg']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ExtendedSearchParamsService, useValue: spy }
            ]
        });

        gravSearchGenerationServ = TestBed.inject(GravsearchGenerationService);
        searchParamsServiceSpy = TestBed.inject(ExtendedSearchParamsService) as jasmine.SpyObj<ExtendedSearchParamsService>;
        searchParamsServiceSpy.changeSearchParamsMsg.and.stub();
    });

    it('should be created', () => {
        expect(gravSearchGenerationServ).toBeTruthy();
    });

    it('should create a Gravsearch query string with an integer property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('1', 'http://www.w3.org/2001/XMLSchema#integer'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#intValueAsInt> ?propVal0Literal
FILTER(?propVal0Literal = "1"^^<http://www.w3.org/2001/XMLSchema#integer>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a decimal property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('1.1', 'http://www.w3.org/2001/XMLSchema#decimal'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#decimalValueAsDecimal> ?propVal0Literal
FILTER(?propVal0Literal = "1.1"^^<http://www.w3.org/2001/XMLSchema#decimal>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a boolean property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('true', 'http://www.w3.org/2001/XMLSchema#boolean'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#booleanValueAsBoolean> ?propVal0Literal
FILTER(?propVal0Literal = "true"^^<http://www.w3.org/2001/XMLSchema#boolean>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a text property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('test', 'http://www.w3.org/2001/XMLSchema#string'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#valueAsString> ?propVal0Literal
FILTER(?propVal0Literal = "test"^^<http://www.w3.org/2001/XMLSchema#string>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a text property matching a value using LIKE', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Like(), new ValueLiteral('test', 'http://www.w3.org/2001/XMLSchema#string'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#valueAsString> ?propVal0Literal
FILTER regex(?propVal0Literal, "test"^^<http://www.w3.org/2001/XMLSchema#string>, "i")


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a text property matching a value using MATCH', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Match(), new ValueLiteral('test', 'http://www.w3.org/2001/XMLSchema#string'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .



FILTER <http://api.knora.org/ontology/knora-api/v2#matchText>(?propVal0, "test"^^<http://www.w3.org/2001/XMLSchema#string>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a URI property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('http://www.google.ch', 'http://www.w3.org/2001/XMLSchema#anyURI'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#uriValueAsUri> ?propVal0Literal
FILTER(?propVal0Literal = "http://www.google.ch"^^<http://www.w3.org/2001/XMLSchema#anyURI>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a date property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('GREGORIAN:2019-02-02', 'http://api.knora.org/ontology/knora-api/simple/v2#Date'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .



FILTER(knora-api:toSimpleDate(?propVal0) = "GREGORIAN:2019-02-02"^^<http://api.knora.org/ontology/knora-api/simple/v2#Date>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a list node property matching a node', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new IRI('http://rdfh.ch/lists/0001/treeList'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#listValueAsListNode> <http://rdfh.ch/lists/0001/treeList>



}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a list node property not matching a node', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new NotEquals(), new IRI('http://rdfh.ch/lists/0001/treeList01'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem> ?propVal0 .



FILTER NOT EXISTS {
                                ?propVal0 <http://api.knora.org/ontology/knora-api/v2#listValueAsListNode> <http://rdfh.ch/lists/0001/treeList01>

                            }


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with restriction to a resource class using offset 0', () => {

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([], 'http://0.0.0.0:3333/ontology/0801/beol/v2#letter', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .



} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0801/beol/v2#letter> .



}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with restriction to a resource class using offset 1', () => {

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([], 'http://0.0.0.0:3333/ontology/0801/beol/v2#letter', 1);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .



} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0801/beol/v2#letter> .



}

OFFSET 1
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(0);

    });

    it('should create a Gravsearch query string with a text property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Like(), new ValueLiteral('Bernoulli', 'http://www.w3.org/2001/XMLSchema#string'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .




?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasText> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#valueAsString> ?propVal0Literal
FILTER regex(?propVal0Literal, "Bernoulli"^^<http://www.w3.org/2001/XMLSchema#string>, "i")


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a date property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new GreaterThanEquals(), new ValueLiteral('GREGORIAN:2018-06-12', 'http://api.knora.org/ontology/knora-api/simple/v2#Date'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .




?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .



FILTER(knora-api:toSimpleDate(?propVal0) >= "GREGORIAN:2018-06-12"^^<http://api.knora.org/ontology/knora-api/simple/v2#Date>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);


    });

    it('should create a Gravsearch query string with a decimal property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal'] as ResourcePropertyDefinition;


        const value = new ComparisonOperatorAndValue(new LessThanEquals(), new ValueLiteral('1.5', 'http://www.w3.org/2001/XMLSchema#decimal'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .




?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#decimalValueAsDecimal> ?propVal0Literal
FILTER(?propVal0Literal <= "1.5"^^<http://www.w3.org/2001/XMLSchema#decimal>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);


    });

    it('should create a Gravsearch query string with an integer property matching a value', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'] as ResourcePropertyDefinition;


        const value = new ComparisonOperatorAndValue(new LessThan(), new ValueLiteral('1', 'http://www.w3.org/2001/XMLSchema#integer'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .




?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#intValueAsInt> ?propVal0Literal
FILTER(?propVal0Literal < "1"^^<http://www.w3.org/2001/XMLSchema#integer>)


}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a linking property matching a resource', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing'] as ResourcePropertyDefinition;


        const value = new ComparisonOperatorAndValue(new Equals(), new IRI('http://rdfh.ch/biblio/QNWEqmjxQ9W-_hTwKlKP-Q'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing> <http://rdfh.ch/biblio/QNWEqmjxQ9W-_hTwKlKP-Q> .

} WHERE {

?mainRes a knora-api:Resource .




?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing> <http://rdfh.ch/biblio/QNWEqmjxQ9W-_hTwKlKP-Q> .






}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a linking property not matching a specific resource', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new NotEquals(), new IRI('http://rdfh.ch/biblio/QNWEqmjxQ9W-_hTwKlKP-Q'));

        const propWithVal = new PropertyWithValue(prop, value, false);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .



} WHERE {

?mainRes a knora-api:Resource .



FILTER NOT EXISTS {
?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing> <http://rdfh.ch/biblio/QNWEqmjxQ9W-_hTwKlKP-Q> .


}



}

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with an integer property matching a value and use it as a sort criterion', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new LessThan(), new ValueLiteral('1', 'http://www.w3.org/2001/XMLSchema#integer'));

        const propWithVal = new PropertyWithValue(prop, value, true);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], undefined, 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .




?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#intValueAsInt> ?propVal0Literal
FILTER(?propVal0Literal < "1"^^<http://www.w3.org/2001/XMLSchema#integer>)


}

ORDER BY ?propVal0

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a decimal property matching a value and use it as a sort criterion', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('1.1', 'http://www.w3.org/2001/XMLSchema#decimal'));

        const propWithVal = new PropertyWithValue(prop, value, true);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal0 .



?propVal0 <http://api.knora.org/ontology/knora-api/v2#decimalValueAsDecimal> ?propVal0Literal
FILTER(?propVal0Literal = "1.1"^^<http://www.w3.org/2001/XMLSchema#decimal>)


}

ORDER BY ?propVal0

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a date property matching a value and use it as a sort criterion', () => {

        const prop = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate'] as ResourcePropertyDefinition;

        const value = new ComparisonOperatorAndValue(new Equals(), new ValueLiteral('GREGORIAN:2019-02-02', 'http://api.knora.org/ontology/knora-api/simple/v2#Date'));

        const propWithVal = new PropertyWithValue(prop, value, true);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .



FILTER(knora-api:toSimpleDate(?propVal0) = "GREGORIAN:2019-02-02"^^<http://api.knora.org/ontology/knora-api/simple/v2#Date>)


}

ORDER BY ?propVal0

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

    it('should create a Gravsearch query string with a date property matching a value used as a sort criterion and an decimal property also used as a sort criterion', () => {

        const prop1 = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate'] as ResourcePropertyDefinition;

        const value1 = new ComparisonOperatorAndValue(new LessThan(), new ValueLiteral('GREGORIAN:2019-02-02', 'http://api.knora.org/ontology/knora-api/simple/v2#Date'));

        const propWithVal1 = new PropertyWithValue(prop1, value1, true);

        const prop2 = MockOntology.mockReadOntology('http://0.0.0.0:3333/ontology/0001/anything/v2').properties['http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal'] as ResourcePropertyDefinition;

        const value2 = new ComparisonOperatorAndValue(new GreaterThan(), new ValueLiteral('0.1', 'http://www.w3.org/2001/XMLSchema#decimal'));

        const propWithVal2 = new PropertyWithValue(prop2, value2, true);

        const gravsearch = gravSearchGenerationServ.createGravsearchQuery([propWithVal1, propWithVal2], 'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing', 0);

        const expectedGravsearch = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
CONSTRUCT {

?mainRes knora-api:isMainResource true .

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .
?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal1 .

} WHERE {

?mainRes a knora-api:Resource .

?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/v2#Thing> .


?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate> ?propVal0 .



FILTER(knora-api:toSimpleDate(?propVal0) < "GREGORIAN:2019-02-02"^^<http://api.knora.org/ontology/knora-api/simple/v2#Date>)

?mainRes <http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal> ?propVal1 .



?propVal1 <http://api.knora.org/ontology/knora-api/v2#decimalValueAsDecimal> ?propVal1Literal
FILTER(?propVal1Literal > "0.1"^^<http://www.w3.org/2001/XMLSchema#decimal>)


}

ORDER BY ?propVal0 ?propVal1

OFFSET 0
`;

        expect(gravsearch).toEqual(expectedGravsearch);

        expect(searchParamsServiceSpy.changeSearchParamsMsg.calls.count()).toEqual(1);

    });

});

