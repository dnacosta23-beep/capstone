"use strict";

console.log("Loading...");

const output = document.getElementById("output");
const form = document.getElementById("form");
const prompt = document.getElementById("input");

//* Get Key Function//
async function getKey() {
  try {
    const options = {
      header: {"consent-Type": "application/json"},
      method: "POST",
    };
    const res = await fetch(
      "https://proxy-key-beep.onrender.com/get-key2",
      options,
    );
    if (!res.ok) {
      throw new Error("Error");
    }
    const {key} = await res.json();
    return key;
  } catch (error) {
    console.error("Error retrieving key");
  }
}
//* Prompt Function//
async function promptToAPI(url, options) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error("Error");
    }
    const result = await res.json();
    return result.result;
  } catch (error) {
    console.error("Error sending prompt");
  }
}

//* Render Function//
function render(response) {
  output.textContent = "";
  const p = document.createElement("p");
  p.textContent = response;
  output.appendChild(p);
}

//* Main function//
async function main() {
  try {
    //* Prompt body for the floral arrangement assistant//
    const promptBody = {
      messages: [
        {
          role: "system",
          content:
            "You are a friendly assistant that helps create floral arrangements and bouquets. You give detailed instructions on how to create the arrangements and bouquets, including the types of flowers to use, the colors, and the overall design. You also provide tips on how to care for the flowers and make them last longer.You can only answer questions about floral arrangements.",
        },
      ],
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const workersEndpiont =
        "https://corsproxy.io/?url=https://api.cloudflare.com/client/v4/accounts/40f1fa4a0a9f754393a97c8f95e40cd4/ai/run/@cf/meta/llama-3-8b-instruct";

      promptBody.messages.push({
        role: "user",
        content: prompt.value,
      });

      const key = await getKey();

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(promptBody),
      };
      const {response} = await promptToAPI(workersEndpiont, options);
      //const response =
        //"Rosses are red, Violets are blue, I am a floral assistant, And I am here to help you!";
      render(response);
      promptBody.messages.push(
       { role: "assistant",
        content: response}
      )
      console.log(response)
    });
  } catch (error) {
    console.log(error);
  }
}

main();
