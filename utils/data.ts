export function pick<T extends object, K extends keyof T>(object: T, keys: K[]) {
    return keys.reduce((obj, key) => {
       if (object && Object.prototype.hasOwnProperty.call(object, key)) {
          obj[key] = object[key];
       }
       return obj;
     }, {} as Pick<T, K>);
  }