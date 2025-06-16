const imageUrlGlob: any = import.meta.glob("../assets/img/**/*", {
  eager: true,
  query: "url",
});

export { imageUrlGlob };
