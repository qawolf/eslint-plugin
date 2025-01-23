export function findBoundary(module1: string, module2: string): string {
  const parts1 = module1.split("/");
  const parts2 = module2.split("/");

  let i = 0;
  while (parts1[i] === parts2[i]) i++;

  return parts1.slice(0, i).join("/");
}
