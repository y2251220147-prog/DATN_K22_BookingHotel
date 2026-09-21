"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";

const MarkDown = ({ children }: { children: string }) => {
  // ✅ FIX 3: Không stringify object — chỉ nhận string
  const content =
    typeof children === "string" ? children : String(children ?? "");

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        // ✅ FIX 1: div → div, không dùng <p> để tránh hydration warning
        div: ({ children }) => (
          <div className="text-base my-6 prose prose-lg">{children}</div>
        ),
        p: ({ children }) => (
          <p className="text-lg leading-relaxed my-2 josefin-sans">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="text-black font-bold">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-orange-500">{children}</em>
        ),
        a: ({ href, children }) => (
          <Link
            href={href || "#"}
            className="underline text-blue-500 my-5"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </Link>
        ),
        img: ({ src, alt }) => {
          const safeSrc = typeof src === "string" ? src : "";
          return (
            <Image
              src={safeSrc}
              alt={alt || ""}
              width={600}
              height={400}
              className="rounded-lg my-4"
              unoptimized
            />
          );
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-gray-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-700 mt-3">
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul
            className="list-disc list-inside"
            style={{
              listStyleType: "revert-layer",
              paddingLeft: "20px",
              marginTop: "8px",
            }}
          >
            {children}
          </ul>
        ),
        li: ({ children }) => <li className="mb-1 josefin-sans">{children}</li>,
        // ✅ FIX 2: Thêm pre cho code block (``` ... ```)
        pre: ({ children }) => (
          <pre className="bg-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm">
            {children}
          </pre>
        ),
        code: ({ children }) => (
          <code className="bg-gray-100 text-sm text-gray-800 px-1 py-0.5 rounded">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkDown;
