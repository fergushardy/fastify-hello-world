/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const port = process.env.PORT || 3000;
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const fastify = require('fastify')({logger: true})
const path = require('node:path')

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', // optional: default '/'
  constraints: { host: 'example.com' } // optional: default {}
})

fastify.get('/another/path', function (req, reply) {
  reply.sendFile('myHtml.html') // serving path.join(__dirname, 'public', 'myHtml.html') directly
})

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Register the fastify-cors plugin
fastify.register(require("@fastify/cors"), {
  origin: ["https://www.mist.com.au"], // Set this to the allowed origin or origins (e.g., 'http://example.com')
  allowedHeaders:
    "Content-Type, Authorization, Origin,X-Requested-With,Accept,Referrer-Policy,endpturl",
  methods: "GET,PUT,POST,OPTIONS",
  credentials: true, //mgk to check
});

const fetch = require("node-fetch");

// Load and parse SEO data
//const seo = require("./src/seo.json");
//if (seo.url === "glitch-default") {
//  seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
//}

/**
 * Our home page route
 *
 * Returns src/pages/index.hbs with data built into it
 */
fastify.get("/", function (request, reply) {
  // params is an object we'll pass to our handlebars template
  let params = { seo: seo };

  // If someone clicked the option for a random color it'll be passed in the querystring
  if (request.query.randomize) {
    // We need to load our color data file, pick one at random, and add it to the params
    const colors = require("./src/colors.json");
    const allColors = Object.keys(colors);
    let currentColor = allColors[(allColors.length * Math.random()) << 0];

    // Add the color properties to the params object
    params = {
      color: colors[currentColor],
      colorError: null,
      seo: seo,
    };
  }

  // The Handlebars code will be able to access the parameter values and build them into the page
  return reply.view("/src/pages/index.hbs", params);
});

//eg https://fantastic-mirage-desert.glitch.me/proxy?endpturl=https://linkgroup.com
//fastify.get("/proxy/:endpturl", function (request, reply) {
//  const { endpturl } = request.params;
//  console.log(endpturl);
//});
// eg /proxy/https%3A%2F%2Fsmh.com.au
fastify.get("/proxy", async (request, reply) => {
  var authorizationHeader = request.headers.authorization;
  var endpturl = request.headers["endpturl"];
  //Ocp-Apim-Subscription-Key
  var ocpapimsub = request.headers["ocpapimsub"];
  console.log(endpturl);
  console.log(ocpapimsub);

  //mk test
  //authorizationHeader = 'Bearer eyJraWQiOiI3SGJscDZIdk40aThVb3dmc2VlZEI5WXg4bnpOQkktNk1pakpHOTBUSUlZIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULk5za0t5bG54U3Y3Qk5BaEtmTHNnc2M4Mlc1RVVFUzBmQndTY3I3VU1RVm8iLCJpc3MiOiJodHRwczovL2xpbmtncm91cC11YXQtbWN4LWhvc3RwbHVzLm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2OTkxNDQyMjEsImV4cCI6MTY5OTE0NzgyMSwiY2lkIjoiMG9hd2JlN3IwdzZIT1p0WHowaDciLCJ1aWQiOiIwMHUxdnhkM2hxY3FDRzQwQzBoOCIsInNjcCI6WyJvcGVuaWQiLCJlbWFpbCIsImdyb3VwcyIsImxpbmtncm91cC5mdW5kYWRtaW4ubWVtYmVyc2VydmljZS5hcGkiLCJtY3giLCJvcGFhLndpZGdldCIsInJpbVdpZGdldEFQSSIsInByb2ZpbGUiLCJsaW5rZ3JvdXAuZnVuZGFkbWluLnBsYW5zZXJ2aWNlLmFwaSJdLCJhdXRoX3RpbWUiOjE2OTkxNDQyMDUsInN1YiI6IjgzMjE3MTIxMCIsImdyb3VwcyI6WyJtY3guZnVuZC5tZW1iZXIiLCJtY3guZnVuZC5tZW1iZXIudGVzdGdyb3Vwd2hpbGVNRkFvcmdkaXNhYmxlZCIsIkV2ZXJ5b25lIl0sImZ1bmRfY29kZSI6IkhPU1RQTFVTIn0.GArgcZIhtcP7cQkluftPjtn-bQpx3uNWfbozC074gqAGHeDiFsFEW3SS2lblcsAE-wBkwEn311HQqW7KzRwwugmCMKL3v5dvSCWjKTZ14OcG32uova03hl2Fai3qWdRcWe-xHcWL_ePPe1U-SFTL9ciMNoiFzHzgp-v04A6-BL8JVI1EajlIJGNgR1cUxW_Tum9N8uSnSM8EpEC5B77_jXWRqx6xlVByMDEABscO2kRDb9mN8mNzciBPywtXarUsrNJb_pkDyD4Mr-9zzj0YrURfQWNg6WmmSi-D3IY-9JUrrGUnWxi8871BsJAQ7-RMeKp-VjiuJGrmgpbIqBASzw';
  //endpturl = 'https://api-test.linkgroup.com/uat1/rss/mcx/web/dashboard/memberdetails/HC/members/832171210?isBenefitAccrualDateRequired=false';
  //ocpapimsub = 'a77363b163634b9a9fedb8998b84ae1b'; //mgk to fix from mist yam

  try {
    // Specify the URL of the remote server
    const remoteServerURL = endpturl;
    var customHeaders;

    // Define custom headers
    if (ocpapimsub === undefined) {
      customHeaders = {
        Authorization: authorizationHeader,
      };
    } else {
      customHeaders = {
        Authorization: authorizationHeader,
        "Ocp-Apim-Subscription-Key": ocpapimsub,
      };
    }

    // Make an HTTP request using node-fetch with custom headers
    const response = await fetch(remoteServerURL, {
      method: "GET",
      headers: customHeaders,
    });

    // Check if the response status code is OK (200)
    if (response.status === 200) {
      // Parse the JSON response
      const data = await response.json();

      // Send the JSON response to the client
      reply.send(data);
    } else {
      // Handle non-200 status codes (e.g., error response)
      reply
        .status(response.status)
        .send("Error: Request to remote server failed " + response.status);
    }
  } catch (error) {
    console.error("Error:", error);
    reply
      .status(500)
      .send("Error: Unable to fetch data from the remote server");
  }

  return { message: "This is the proxy route." };
});

/**
 * Our POST route to handle and react to form submissions
 *
 * Accepts body data indicating the user choice
 */
fastify.post("/", function (request, reply) {
  console.log(request.query);
  console.log("mk was here");

  return { message: "This is the root route." };
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
