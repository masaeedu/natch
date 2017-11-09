const fail = err => {
  throw new Error(err);
};

export default (p, ...c) => {
  const cases = new Map(c);
  return x => {
    const curr = p(x);
    return (cases.get(curr) || fail(`Handler for case ${curr} is missing`))(x);
  };
};
