const fail = err => {
  throw new Error(err);
};

const otherwise = Symbol("natch default case symbol");

const match = (p, ...c) => {
  const cases = new Map(c);
  return x => {
    const curr = p(x);
    const f =
      cases.get(curr) ||
      cases.get(otherwise) ||
      fail(`Handler for case ${curr} is missing`);
    return f(x);
  };
};

export { otherwise, match, match as default };
