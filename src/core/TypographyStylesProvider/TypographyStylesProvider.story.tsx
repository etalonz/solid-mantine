import { TypographyStylesProvider } from "./TypographyStylesProvider";

export default { title: "TypographyStylesProvider" };

const content = `
<pre><code>{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}</code></pre>
`;

export function CodeBlock() {
  return (
    <div style={{ padding: "40px" }}>
      <TypographyStylesProvider>
        <div innerHTML={content} />
      </TypographyStylesProvider>
    </div>
  );
}
