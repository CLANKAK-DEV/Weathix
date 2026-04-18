export const ROLE = Object.freeze({
  USER: 'user',
  BOT: 'bot',
});

export function createMessage(role, text, { isError = false } = {}) {
  return { role, text, isError };
}

export const userMessage = (text) => createMessage(ROLE.USER, text);
export const botMessage = (text) => createMessage(ROLE.BOT, text);
export const errorMessage = (text) => createMessage(ROLE.BOT, text, { isError: true });
