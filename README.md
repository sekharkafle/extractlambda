# Service Code for Extracting Key Data
This is a server side code for a simple application to extract key data from an input text. Below diagram shows interaction between different components of this application:
![Extract Architecture](extract.svg)

The backend code creates and sends the text prompt to the AI model to extract key values from the input text:


```
const formatExtractMessage = (message) => {
  const txt = message.text;
    const fields = message.fields.join(', ');
    return `Human:You are an expert assistant with expertise in extracting key values.
     From the given text, extract ${fields}. If an extracted value is currency,
      return it as a whole number.\n<TEXT>${txt}</TEXT>\n\nAssistant:`;
};

export const handler = async (event)=> {
  dotenv.config();
  if (event) {
    const bedrock = new BedrockRuntimeClient({
      serviceId: 'bedrock',
      region: 'us-east-1',
    });
    let prompt = "";
    if(event.extractMessage){
      prompt = formatExtractMessage(event.extractMessage);
    const resText = await sendAIRequest(prompt);
    let aiRes = JSON.parse(resText)
    return aiRes.completion
  }
  return {
    statusCode: 400,
    body: `{'error':'Invalid input params.'}`,
  };
};

```

Here is the response from the service:

```
"Company name: ABC inc.\nDemographic: school aged children
\nAnnual income: 12000000\nBusiness type: selling ice cream"
```

In this application, the extracted response is in text format because we haven't specified the response format in our prompt.

```
`Human:You are an expert assistant with expertise in extracting key values. 
From the given text, extract ${fields}. If an extracted value is currency,
 return it as a whole number.\n<TEXT>${txt}</TEXT>\n\nAssistant:
```

In a real world application, the extracted values may be used to query database or call a webservice to return more meaningful result to the user. So the response in json format would be more approipriate in that case. We can modify the prompt to respond data in json format.

```
Human:You are an expert assistant with expertise in extracting key values. 
From the given text, extract company name,demographic,annual income,business type.
 If an extracted value is currency, return it as a whole number.
  Response should be in JSON format with no other text in response.\n
  <TEXT>I want to learn about ABC inc. selling ice cream for school aged 
  children and making 1M monthly income</TEXT>\n\nAssistant:
```
Now the response looks more appropriate for consumption:
```
{
  "company_name": "ABC inc.",
  "demographic": "school aged children", 
  "annual_income": 12000000,
  "business_type": "selling ice cream"
}
```


As for the UI code, source code for a companion UI app is available here. [https://github.com/sekharkafle/extractui](https://github.com/sekharkafle/extractui)
