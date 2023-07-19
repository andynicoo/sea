import NextDocument, { Html as DocumentHtml, Head as DocumentHead, Main as DocumentMain, NextScript } from "next/document";
class Document extends NextDocument {
    static async getInitialProps(ctx: any) {
        const initialProps = await NextDocument.getInitialProps(ctx);
        return { ...initialProps }
    }

    render() {
        return <DocumentHtml lang="zh-CN">
            <DocumentHead />
            <body>
                <DocumentMain />
            </body>
            <NextScript />
        </DocumentHtml>
    }
}

export default Document;
