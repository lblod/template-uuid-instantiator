# Template Uuid Instantiator

This package allows you to instantiate uris of a string.

## Usage

The utility loops over the text supplied and identifies the strings with the form `"https://example.org/--ref-algorithm-123-456-abc"`, we will explain each part below. It allows both " and '

- Base uri: In the example is the `https://example.org/` part, this part will be preserved in the result uri
- Uuid: This part is the `--ref-algorithm-123-456-abc` in the example. it has itself 3 parts:
  - --ref: This will be ignored in the result, it indicates you want this uri to be replaced
  - algorithm: It will indicate which algorithm will be used to generate the uuid, look at the algorithms section to see which ones are supported
  - 123-456-abc: This is an uuid that is used as memoization, combinations of the same base uri and uuid will generate the same uri. If they have different algorithms the first one that appears on the string will be used.

## Algorithms

The following algorithms are supported:

- uuid4: This uses the uuidv4 algorithm from the uuid npm package [https://www.npmjs.com/package/uuid](https://www.npmjs.com/package/uuid). This will be the default algorithm used if the specified one is not found. An example on how to use this algorithm would be `"https://example.org/--ref-uuid4-123-456-abc"`

## Example

This is an example of a small app using the library

```js
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';

const document = `
<div resource="https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20">
<div resource="https://example.org/--ref-uuid4-bd17cfee-d836-42d1-be3c-9bb1bc276e20">
<div resource="https://example.org/--ref-uuid4-99e2d904-93b5-4d8a-aa5d-5ab6408226b6">
`;

const instantiatedDocument = templateUuidInstantiator(document);
```
