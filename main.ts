import { getAllItems, submitItem, downvoteItem, upvoteItem, getItem } from "./list.ts"
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
    
export let home_url: URL;

serve(handler, {
    onListen({ port, hostname}) {
        console.log(`Server started at http://${hostname}:${port}`);
        home_url = new URL("http://" +hostname +":"+port);
    }
})

async function handler(req: Request): Promise<Response> {
    const url_breakout = String(req.url).split('/');
    // The first three elements are
    // http / https 
    // subdomain
    // domain
    console.log(req.method + " " + req.url)
    switch(req.method) {
        case "POST": {
            if (url_breakout[3+0] == "api") {
                switch (url_breakout[3+1]) {
                    case "upvote": {
                        const vote = url_breakout[3+2];
                        upvoteItem(Number.parseInt(vote));
                        return new Response("", {status:200})
                    }
                    case "downvote": {
                        const vote = url_breakout[3+2];
                        downvoteItem(Number.parseInt(vote));
                        return new Response("", {status:200})
                    }
                    case "submititem": {
                        const body = await req.formData();
                        const name = body.get("item_name")?.toString() || "";
                        const link = body.get("item_link")?.toString() || "";
                        submitItem(name, new URL(link));
                        return Response.redirect(home_url);
                    }
                    default: {
                       break; 
                    }
                }
            }
            break;
        }
 
        default: {
            switch (url_breakout[3+0]) {
                case "api": {
                    switch (url_breakout[3+1]) {
                        case "getlist": {
                            return new Response(getAllItems(), {
                                headers: { "content-type": "application/json; charset=utf-8" },
                            });
                        }
                        case "getitem": {
                            const index = url_breakout[3+2];
                            return new Response(getItem(Number.parseInt(index)));
                        }
                    }
                   break;
                }
                default: {
                    return fileServe(req);
                }
            }
        }
    }
    // the ultimate default case
    return new Response("Invalid", { status: 404});
}

async function fileServe(req: Request) {
    
    const url = new URL(req.url);

    if (url.pathname == "/") {
        url.pathname = "index.html";
    }
    const filepath = decodeURIComponent(url.pathname);

    // Try opening the file
    let file;
    try {
        // TODO test path traversal attacks
        file = await Deno.open("./www" + filepath, { read: true });
    } catch {
        // If the file cannot be opened, return a "404 Not Found" response
        const notFoundResponse = new Response("404 Not Found", {
          status: 404,
        });
        return notFoundResponse;
    }
    // Build a readable stream so the file doesn't have to be fully loaded into
    // memory while we send it
    const readableStream = file.readable;
                
    // Build and send the response
    const response = new Response(readableStream);
    return response;

}
