# Search results (Component)

The search-results component gets the search mode and parameters from routes or inputs, and returns the corresponding resources that are displayed in a list or a grid. The results can be filtered by project.

## List of parameters

- complexView (optional)
- searchQuery (optional)
- searchMode (optional)
- projectIri (optional)

***

## Simple search results example

### HTML file

```html
<dsp-search-results></dsp-search-results>
```

![Simple search results example](../../assets/images/search-results-simple.png)

## Search results filtered by project example

### HTML file

```html
<dsp-search-results [projectIri]="projectIri"></dsp-search-results>
```

### Typescript file

```ts
export class SearchResultsComponent {

    projectIri = 'http://rdfh.ch/projects/0001';  // project iri

    constructor() { }
}
```

![Search results filtered by project example](../../assets/images/search-results-filter.png)

## Search results providing search mode and query parameters example

### HTML file

```html
<!-- example of an advanced search where we pass a gravsearch query as search parameter -->
<dsp-search-results [searchMode]="'extended'" [searchQuery]="gravsearch"></dsp-search-results>
```

### Typescript file

```ts
export class SearchResultsComponent {

    gravsearch: string = `PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
                        CONSTRUCT {
                        ?mainRes knora-api:isMainResource true .
                        } WHERE {
                        ?mainRes a knora-api:Resource .
                        ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/simple/v2#BlueThing> .
                        }
                        OFFSET 0`;

    constructor() { }
}
```

![Search results providing search mode and query parameters example](../../assets/images/search-results-filter.png)
