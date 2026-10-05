import os

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("FEATHERLESS_API_KEY")

if not api_key:
    raise ValueError("FEATHERLESS_API_KEY is missing from the .env file.")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.featherless.ai/v1"
)


def get_ai_response(message, profile=None):
    profile = profile or {}

    name = profile.get("name", "Student")
    graduation_year = profile.get("graduationYear", "Not provided")
    gpa = profile.get("gpa", "Not provided")
    test_score = profile.get("testScore", "Not provided")
    major = profile.get("major", "Not provided")
    college = profile.get("college", "Not provided")

    instructions = f"""
You are AI College Navigator, a friendly college-planning
assistant for high school students.

Student profile:
- Name: {name}
- Graduation year: {graduation_year}
- GPA: {gpa}
- SAT/ACT: {test_score}
- Intended major: {major}
- Target college: {college}

Give practical, clear, age-appropriate college planning advice.

Use the student's profile when it is relevant.

If information such as deadlines, tuition, admission requirements,
or scholarships may have changed, tell the student to verify it
with the college's official website.

Do not make up specific college requirements.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": instructions
            },
            {
                "role": "user",
                "content": message
            }
        ],
        temperature=0.7
    )

    return response.choices[0].message.content