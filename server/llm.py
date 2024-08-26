import os
import re
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client1 = Groq(api_key=os.getenv("GROQ_API_KEY1")) # For generating the design 
client2 = Groq(api_key=os.getenv("GROQ_API_KEY2")) # For modifying the design    ---- If Both API key is from different account (Recommended).



def LLM1(system_msg,user_msg):
    completion = client1.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_msg
            },
            {
                "role": "user",
                "content": user_msg
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

    return completion.choices[0].message

def LLM2(system_msg,user_msg):
    completion = client2.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_msg
            },
            {
                "role": "user",
                "content": user_msg
            }
        ],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False,
        stop=None,
    )

    return completion.choices[0].message


def extract_partial_code(content, language):
    regex = rf"```{language}\s*([\s\S]*?)(```|$)"
    match = re.search(regex, content, re.IGNORECASE)
    return match.group(1) if match else ''

def generate_website(description):
    try:
        response = LLM1(
                    system_msg = "You are an expert web developer. Generate HTML and CSS code based on the given description. Respond with HTML code first, followed by CSS code. Use ```html and ```css code blocks to enclose the respective code.",
                    user_msg = f"Create a website with the following description: {description}. Return the HTML and CSS separately, enclosed in code blocks."
                )
        return response
    except Exception as error:
        print('Error calling OpenAI API:', str(error))
        raise Exception(f'Failed to generate website: {str(error)}')

def modify_website(modification_description, current_html, current_css):
    try:
        response = LLM2(
                    system_msg = "You are an expert web developer. Modify the given HTML and CSS code based on the provided modification description. Respond with the updated HTML code first, followed by the updated CSS code. Use ```html and ```css code blocks to enclose the respective code.",
                    user_msg = f"""
                    Current HTML:
                    ```html
                    {current_html}
                    ```

                    Current CSS:
                    ```css
                    {current_css}
                    ```

                    Modification description: {modification_description}

                    Please update the HTML and CSS based on the modification description. Return the complete updated HTML and CSS separately, enclosed in code blocks.
                    """
                )
        return response
    except Exception as error:
        print('Error calling OpenAI API:', str(error))
        raise Exception(f'Failed to generate website: {str(error)}')
