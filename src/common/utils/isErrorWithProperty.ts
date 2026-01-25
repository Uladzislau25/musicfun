/* Синтаксис error is { T: string } означает, что если функция возвращает true, TypeScript будет рассматривать
error как объект с обязательным строковым свойством T. */
export function isErrorWithProperty<T extends string>(error: unknown, property: T): error is Record<T, string> {
  return (
    typeof error === "object" && // Проверяем, что error – это объект
    error != null && // Убеждаемся, что это не null
    property in error && // Проверяем, что у объекта есть свойство 'T'
    typeof (error as Record<string, unknown>)[property] === "string" // Убеждаемся, что это строка
  )
}
