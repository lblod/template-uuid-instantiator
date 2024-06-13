import { v4 as uuidv4 } from 'uuid';

type AlgorithmFunction = () => string;
interface MemoizationEntry {
  uri: string;
  uuidAlgorithm: string;
}

const algorithms: Record<string, AlgorithmFunction> = {
  uuid4: uuidv4,
};

function replacingAlgorithm(
  memoizationTable: Record<string, MemoizationEntry>,
  _: unknown,
  uriBase: string,
  uuidAlgorithm: string,
  originalUuid: string,
) {
  const memoizationEntry = memoizationTable[`${uriBase}${originalUuid}`];
  if (memoizationEntry) {
    if (memoizationEntry.uuidAlgorithm !== uuidAlgorithm) {
      console.warn(
        `You have 2 entries with the same uri base and uuid, but different algorithm, this is probably and error so the result will be the same uuid in both entries. ${uriBase}--ref-<${uuidAlgorithm}>-${originalUuid} and ${uriBase}--ref-<${memoizationEntry.uuidAlgorithm}>-${originalUuid}`,
      );
    }
    return memoizationTable[`${uriBase}${originalUuid}`].uri;
  } else {
    if (!algorithms[uuidAlgorithm]) {
      console.warn(`${uuidAlgorithm} was not recognised, using uuid4 instead`);
    }
    const algorithm = algorithms[uuidAlgorithm] || uuidv4;
    const finalUri = `"${uriBase}${algorithm()}"`;
    memoizationTable[`${uriBase}${originalUuid}`] = {
      uri: finalUri,
      uuidAlgorithm,
    };
    return finalUri;
  }
}

function curryReplacingAlgorithm(
  memoizationTable: Record<string, MemoizationEntry>,
) {
  return (
    _: unknown,
    uriBase: string,
    uuidAlgorithm: string,
    originalUuid: string,
  ) => {
    return replacingAlgorithm(
      memoizationTable,
      _,
      uriBase,
      uuidAlgorithm,
      originalUuid,
    );
  };
}

export default function instantiateUuids(templateString: string) {
  const memoizationTable = {};
  const replacingAlgorithmBinded = curryReplacingAlgorithm(memoizationTable);
  return templateString.replace(
    /["']([^"']+)--ref-<([^"'>]+)>-([^"']+)["']/g,
    replacingAlgorithmBinded,
  );
}
