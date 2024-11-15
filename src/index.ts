import { v4 as uuidv4 } from 'uuid';

type AlgorithmFunction = () => string;
interface MemoizationEntry {
  finalUuid: string;
  uuidAlgorithm: string;
}

const algorithms: Record<string, AlgorithmFunction> = {
  uuid4: uuidv4,
};

function replacingAlgorithm(
  memoizationTable: Record<string, MemoizationEntry>,
  uuidAlgorithm: string,
  originalUuid: string,
) {
  const memoizationEntry = memoizationTable[originalUuid];
  if (memoizationEntry) {
    if (memoizationEntry.uuidAlgorithm !== uuidAlgorithm) {
      console.warn(
        `You have 2 entries with the same uuid, but different algorithms, this is probably and error so the result will be the same uuid in both entries. --ref-<${uuidAlgorithm}>-${originalUuid} and --ref-<${memoizationEntry.uuidAlgorithm}>-${originalUuid}`,
      );
    }
    return memoizationTable[originalUuid].finalUuid;
  } else {
    if (!algorithms[uuidAlgorithm]) {
      console.warn(`${uuidAlgorithm} was not recognised, using uuid4 instead`);
    }
    const algorithm = algorithms[uuidAlgorithm] || uuidv4;
    const finalUuid = algorithm();
    memoizationTable[originalUuid] = {
      finalUuid,
      uuidAlgorithm,
    };
    return finalUuid;
  }
}

function curryReplacingAlgorithm(
  memoizationTable: Record<string, MemoizationEntry>,
) {
  return (
    _: unknown,
    uuidAlgorithm: string,
    originalUuid: string,
  ) => {
    return replacingAlgorithm(
      memoizationTable,
      uuidAlgorithm,
      originalUuid,
    );
  };
}

export default function instantiateUuids(templateString: string) {
  const memoizationTable = {};
  const replacingAlgorithmBinded = curryReplacingAlgorithm(memoizationTable);
  return templateString.replace(
    /--ref-([a-zA-Z0-9]+)-([a-zA-Z0-9-]+)/g,
    replacingAlgorithmBinded,
  );
}
