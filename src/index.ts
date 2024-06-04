import { v4 as uuidv4 } from 'uuid';

type AlgorithmFunction = () => string;

const algorithms: Record<string, AlgorithmFunction> = {
  uuid4: uuidv4,
};

function replacingAlgorithm(
  memoizationTable: Record<string, string>,
  _: unknown,
  uriBase: string,
  uuidAlgorithm: string,
  originalUuid: string,
) {
  if (memoizationTable[`${uriBase}${originalUuid}`]) {
    return memoizationTable[`${uriBase}${originalUuid}`];
  } else {
    const algorithm = algorithms[uuidAlgorithm] || uuidv4;
    const finalUri = `"${uriBase}${algorithm()}"`;
    memoizationTable[`${uriBase}${originalUuid}`] = finalUri;
    return finalUri;
  }
}

// We disable typescript linting here as the curry function should indeed accept any function and any arguments
// eslint-disable-next-line  @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
function currying(fn: Function, ...args: any[]) {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return (..._arg: any) => {
    return fn(...args, ..._arg);
  };
}

export default function instantiateUuids(templateString: string) {
  const memoizationTable = {};
  const replacingAlgorithmBinded = currying(
    replacingAlgorithm,
    memoizationTable,
  );
  return templateString.replace(
    /"([^"]*)--ref-<([^"]*)>-([^"]*)"/g,
    replacingAlgorithmBinded,
  );
}
