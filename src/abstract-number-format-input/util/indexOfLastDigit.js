export default function indexOfLastDigit(str) {
  const match = /\d\D*$/.exec(str);
  return match ? match.index : -1;
}
