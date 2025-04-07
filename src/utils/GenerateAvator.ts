export const GenerateAvator = (username: string) => {
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}.svg`;
};
