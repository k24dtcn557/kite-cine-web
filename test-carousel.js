let prev = 0;
let len = 3;
for (let i = 0; i < 10; i++) {
  prev = (prev - 1 + len) % len;
  console.log('prev:', prev);
}
for (let i = 0; i < 10; i++) {
  prev = (prev + 1) % len;
  console.log('next:', prev);
}
