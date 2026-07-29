import type { BlocksContent, BlocksInlineNode } from "@/lib/types";
import { mediaUrl } from "@/lib/api";
import Image from "next/image"; // Imported for Next.js image optimization

// Define a local interface to fix the eslint @typescript-eslint/no-explicit-any error
interface ImageBlockFallback {
  caption?: string;
  image?: {
    caption?: string;
    alternativeText?: string;
  };
}

function renderInline(node: BlocksInlineNode, key: number): React.ReactNode {
  if (node.type === "link") {
    const isExternal = node.url.startsWith("http");
    const target = isExternal ? "_blank" : undefined;
    const rel = isExternal ? "noopener noreferrer" : undefined;

    return (
      <a
        key={key}
        href={node.url}
        className="underline underline-offset-2 hover:text-neutral-600"
        target={target}
        rel={rel}
      >
        {node.children.map((child, i) => renderInline(child, i))}
      </a>
    );
  }

  let content: React.ReactNode = node.text;
  if (node.code) content = <code className="bg-neutral-100 px-1 py-0.5 rounded text-sm" key={key}>{content}</code>;
  if (node.strikethrough) content = <s>{content}</s>;
  if (node.underline) content = <u>{content}</u>;
  if (node.italic) content = <em>{content}</em>;
  if (node.bold) content = <strong>{content}</strong>;

  return <span key={key}>{content}</span>;
}

const headingClasses: Record<number, string> = {
  1: "text-3xl font-semibold tracking-tight mt-8 mb-4",
  2: "text-2xl font-semibold tracking-tight mt-8 mb-3",
  3: "text-xl font-semibold tracking-tight mt-6 mb-3",
  4: "text-lg font-semibold mt-6 mb-2",
  5: "text-base font-semibold mt-4 mb-2",
  6: "text-sm font-semibold mt-4 mb-2",
};

export function BlocksRenderer({ content }: { content: BlocksContent | null | undefined }) {
  if (!content || content.length === 0) return null;

  return (
    <div className="prose-neutral max-w-none text-neutral-800">
      {content.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="mb-4 leading-relaxed">
                {block.children.map((child, j) => renderInline(child, j))}
              </p>
            );

          case "heading": {
            const Tag = `h${block.level}` as keyof React.JSX.IntrinsicElements;
            return (
              <Tag key={i} className={headingClasses[block.level] || headingClasses[3]}>
                {block.children.map((child, j) => renderInline(child, j))}
              </Tag>
            );
          }

          case "quote":
            return (
              <blockquote key={i} className="border-l-4 border-neutral-300 pl-4 italic my-4 text-neutral-600">
                {block.children.map((child, j) => renderInline(child, j))}
              </blockquote>
            );

          case "code":
            return (
              <pre key={i} className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm my-4">
                <code>
                  {block.children.map((child, j) => renderInline(child, j))}
                </code>
              </pre>
            );

          case "list": {
            const ListTag = block.format === "ordered" ? "ol" : "ul";
            const listClass = block.format === "ordered" ? "list-decimal pl-6 my-4 space-y-1" : "list-disc pl-6 my-4 space-y-1";
            return (
              <ListTag key={i} className={listClass}>
                {block.children.map((listItem, j) => (
                  <li key={j}>
                    {listItem.children.map((child, k) => renderInline(child, k))}
                  </li>
                ))}
              </ListTag>
            );
          }

          case "image": {
            if (!block.image) return null;
            const src = mediaUrl(block.image.url);
            
            // Replaced Record<string, any> with a specific shape to appease ESLint
            const imageBlock = block as unknown as ImageBlockFallback;
            const caption = imageBlock.caption || imageBlock.image?.caption || imageBlock.image?.alternativeText;

            // Strapi provides numerical dimensions. If missing, fallback to 800x600 placeholders
            const width = block.image.width || 800;
            const height = block.image.height || 600;

            return (
              <div key={i} className="my-6">
                <Image
                  src={src}
                  alt={block.image.alternativeText || ""}
                  width={width}
                  height={height}
                  className="rounded-lg max-w-full h-auto mx-auto"
                />
                {caption && (
                  <p className="text-center text-xs text-neutral-500 mt-2">
                    {caption}
                  </p>
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
