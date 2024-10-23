export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // padStart(2, '0'); 는 각각의 값은 2칸이고 나머지 빈칸을 0으로 채웁니다. 만약 1월 이라고 하면 '1' -> '01'로 바꿔준다는 겁니다.

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}
