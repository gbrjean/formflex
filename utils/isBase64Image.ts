export function isBase64Image(data: string) {
  const regex = /^data:image\/(png|jpg|jpeg|gif);base64,/;
  return regex.test(data);
}
