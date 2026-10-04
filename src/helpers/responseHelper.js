/**
 * Membaca respons JSON dari API Delcom dan melempar Error
 * apabila API melaporkan kegagalan.
 */
export async function parseResponse(response, fallbackMessage) {
  const result = await response.json();
  if (result.status !== "success" && !result.success) {
    throw new Error(result.message || fallbackMessage);
  }
  return result;
}