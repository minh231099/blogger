import { useEffect, useState } from "react";
import { serializeHtml } from '@udecode/plate-serializer-html';

type PostContentProps = {
    content: string
}

const PostContent = (props: PostContentProps) => {
    const { content } = props;
    const [contentObj, setContentObj] = useState(JSON.parse(content));

    useEffect(() => {
        if (content) setContentObj(JSON.parse(content));
    }, [content]);

    return (
        <div>
            <RenderContent content={contentObj} />
        </div>
    )
}

export type ContentElm = {
    id?: string;
    url?: string;
    width?: number;
    caption?: {
        text: string;
    }[];
    children: {
        text: string;
        italic?: boolean;
        bold?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
        code?: boolean;
        superscript?: boolean;
        subscript?: boolean;
        id?: string;
        type?: string;
        children?: {
            text: string;
        }[];
        url?: string;
    }[];
    type: string;
    listStyleType?: string;
    indent?: number;
    listStart?: number;
}

type RenderContentProps = {
    content: ContentElm[],
}

const RenderContent = (props: RenderContentProps) => {
    const { content } = props;

    return (
        <div>
            {
                content.map((c, index) => {
                    const { children } = c;
                    let tmp = '';

                    if (c.listStyleType == 'disc') {
                        tmp = MakeToListIndentDisc(c.children[0].text);
                        return <div key={index} dangerouslySetInnerHTML={createMarkup(tmp)}></div>
                    }

                    if (c.listStyleType == "decimal") {
                        tmp = MakeToListIndentDecimal(c.children[0].text, c.listStart ? c.listStart : 1);
                        return <div key={index} dangerouslySetInnerHTML={createMarkup(tmp)}></div>
                    }

                    if (c.type == 'img') {
                        tmp = MakeToImage(c.url!, c?.caption?.[0].text!, c.width!)
                        return <div className="flex justify-center my-5" key={index} dangerouslySetInnerHTML={createMarkup(tmp)}></div>
                    }

                    if (c.type == 'table') {
                        tmp = MakeToTable(c);
                        return <div key={index} dangerouslySetInnerHTML={createMarkup(tmp)}></div>
                    }

                    children.forEach(value => {
                        if (value) {
                            let tmpV = HandleText(value);
                            tmp += tmpV;
                        }
                    })

                    if (c.type == 'h1') tmp = MakeToH1(tmp);
                    if (c.type == 'h2') tmp = MakeToH2(tmp);
                    if (c.type == 'h3') tmp = MakeToH3(tmp);
                    if (c.type == 'blockquote') tmp = MakeToBlockquote(tmp);

                    tmp += '<br/>'

                    return <div key={index} dangerouslySetInnerHTML={createMarkup(tmp)}></div>
                })
            }
        </div>
    )
}

const createMarkup = (value: string) => {
    return { __html: value };
}

const HandleText = (value: any) => {
    if (value) {
        let tmpV = value.text;
        switch (value.type) {
            case 'a':
                tmpV = MakeToATag(value?.children?.[0]?.text, value.url)
                break;
            default:
                if (value.bold) {
                    tmpV = MakeToBold(tmpV);
                }
                if (value.italic) {
                    tmpV = MakeToItalic(tmpV);
                }
                if (value.underline) {
                    tmpV = MakeToUnderline(tmpV);
                }
                if (value.strikethrough) {
                    tmpV = MakeToStrikethrough(tmpV);
                }
                if (value.code) {
                    tmpV = MakeToCode(tmpV);
                }
                if (value.superscript) {
                    tmpV = MakeToSuperscript(tmpV);
                }
                if (value.subscript) {
                    tmpV = MakeToSubscript(tmpV);
                }
                break;
        }
        return tmpV;
    }
    return '';
}

const MakeToTable = (content: any) => {
    const { children } = content;
    let tmp = '';

    children.forEach((value: any) => {
        let tmpV = '';
        value.children.forEach((valueC: any) => {
            tmpV += `<td>${valueC.children[0].children[0].text}</td>`
        })
        tmp += `<tr>${tmpV}</tr>`
    })

    return `<table>${tmp}</table>`;
}

const MakeToListIndentDisc = (value: string) => {
    return `<span>- ${value}</span>`
}

const MakeToListIndentDecimal = (value: string, pos: number) => {
    return `<span>${pos}. ${value}</span>`
}

const MakeToImage = (url: string, caption: string, width: number) => {
    return `<div class="flex flex-col items-center"><img src='${url}' alt="${caption}" width="${width}"></img><i class="text-gray-600">${caption}</i></div>`
}

const MakeToH1 = (text: string) => {
    return `<h1 class="text-3xl font-bold px-0 mx-0">${text}</h1>`
}

const MakeToH2 = (text: string) => {
    return `<h2 class="text-2xl font-bold">${text}</h2>`
}

const MakeToH3 = (text: string) => {
    return `<h3 class="text-1xl font-bold">${text}</h3>`
}

const MakeToBlockquote = (text: string) => {
    return `<blockquote class="border-l-4 border-gray-300 pl-4 italic bg-gray-100">${text}</blockquote>`
}

const MakeToATag = (text: string | undefined, url: string | undefined) => {
    return `<a class="text-blue-500 hover:text-blue-700 font-bold" href='${url}' target="_blank">${text}</a>`
}

const MakeToBold = (text: string) => {
    return `<b>${text}</b>`
}

const MakeToItalic = (text: string) => {
    return `<i>${text}</i>`
}

const MakeToUnderline = (text: string) => {
    return `<u>${text}</u>`
}

const MakeToStrikethrough = (text: string) => {
    return `<s>${text}</s>`
}

const MakeToCode = (text: string) => {
    return `<code>${text}</code>`
}

const MakeToSuperscript = (text: string) => {
    return `<sup>${text}</sup>`
}

const MakeToSubscript = (text: string) => {
    return `<sub>${text}</sub>`
}

export default PostContent;