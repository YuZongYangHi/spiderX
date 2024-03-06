export const ParserTime = (s: string)  => {
  let num = parseInt(s.slice(0, s.length -1));
  let unit = s[s.length -1]
  const now = new Date();
  switch (unit) {
    case 'h':
      return new Date(now.getTime() + num * 60 * 60 * 1000);
    case 'm':
      return new Date(now.getTime() + num * 60 * 1000);
    case 's':
      return new Date(now.getTime() + num * 1000);
    case 'd':
      return new Date(now.getTime() + num * 24 * 60 * 60 * 1000);
  }
  return now;
}
