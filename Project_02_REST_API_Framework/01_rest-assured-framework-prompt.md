# RICE-POT Prompt: Rest Assured API Testing Framework (Java)

> **How to use:** Paste the prompt block below into your AI tool (e.g., Claude, ChatGPT, Copilot).
> Attach any API spec (OpenAPI/Swagger/Postman collection) you have before sending.
> The AI will build the framework file-by-file, narrating as it goes.

---

```markdown
## Objective
Build a complete, production-ready REST API automation testing framework using
Rest Assured 5.x and Java 17. The framework must be usable by a QA engineer
immediately after generation — covering CRUD test coverage, authentication,
data-driven testing, reporting, and CI/CD integration.

---

### R — Role
You are a Senior SDET (Software Development Engineer in Test) with 12+ years of
experience designing enterprise-grade API automation frameworks in Java. You are
an expert in Rest Assured, TestNG, Maven, Allure Reporting, and CI/CD pipelines
with GitHub Actions. You write clean, maintainable, well-commented code and
explain architectural decisions as you build.

---

### I — Instructions

Follow these steps in exact order:

1. **Print the full project folder structure** first as a tree diagram before
   writing any code. Label every file with a one-line description of its purpose.

2. **Generate each file in sequence**, announcing the file path as a heading
   (e.g., `### src/test/java/config/ConfigManager.java`) before its code block.

3. **Build the framework in this layer order:**
   - Configuration layer (`config/`)
   - Base layer (`base/`)
   - Utility layer (`utils/`)
   - POJO/Model layer (`models/`)
   - API helper/service layer (`api/`)
   - Test layer (`tests/`)
   - Resources (test data, environment configs)
   - `pom.xml`
   - CI/CD pipeline (`.github/workflows/api-tests.yml`)

4. For **each file**, after the code block, write a short "Why this file exists"
   paragraph in plain English explaining its role in the framework.

5. Implement **all five capabilities** below — do not skip any:
   - **CRUD coverage:** GET, POST, PUT, PATCH, DELETE test examples using
     `https://reqres.in` as the sample API (no real credentials needed).
   - **Auth handling:** Implement Bearer token, Basic Auth, and OAuth2 client
     credentials — each as a reusable utility method in an `AuthManager` class.
   - **Data-driven testing:** Drive at least one test from an Excel file
     (Apache POI), one from a JSON file, and one from a CSV file. Place test
     data files under `src/test/resources/testdata/`.
   - **Reporting:** Integrate Allure Reports with `@Step` annotations on all
     helper methods, and ExtentReports as a TestNG listener generating an HTML
     report to `target/extent-reports/`.
   - **CI/CD:** Provide a GitHub Actions workflow that runs `mvn test` on push
     to `main`, caches Maven dependencies, and uploads the Allure report as a
     build artifact.

6. Include a **`README.md`** as the final file with:
   - Prerequisites (Java 17, Maven, Allure CLI)
   - How to run locally (`mvn test`)
   - How to run a specific suite (`mvn test -Dsuite=smoke`)
   - How to view the Allure report (`allure serve target/allure-results`)
   - Project structure summary

Do NOT:
- Generate placeholder/stub code — every class must be fully implemented.
- Use deprecated Rest Assured APIs (e.g., avoid `given().expect()` style;
  use `given().when().then()` BDD style throughout).
- Hardcode credentials, base URLs, or environment values — all must be read
  from a `config.properties` file or environment variables.
- Skip the `pom.xml` — it must declare all dependency versions explicitly
  (no version ranges like `[5,)`).
- Mix test logic into helper/service classes — keep layers strictly separated.
- Use JUnit — this framework is TestNG-only.

---

### C — Context

- **Language & Runtime:** Java 17
- **Core library:** Rest Assured 5.x
- **Build tool:** Maven (latest stable)
- **Test runner:** TestNG 7.x
- **Reporting:** Allure 2.x + ExtentReports 5.x
- **Data-driven:** Apache POI (Excel), Jackson (JSON), OpenCSV (CSV)
- **Auth patterns needed:** Bearer token, Basic Auth, OAuth2 client credentials
- **Sample API:** `https://reqres.in` (public, no real auth needed — simulate
  auth patterns with mock tokens)
- **CI/CD target:** GitHub Actions
- **Audience:** A QA engineer who will clone the repo, add real base URLs and
  credentials to `config.properties`, and immediately run tests — no scaffolding
  left for them to write.

---

### E — Example

Below is an example of the expected style for a single test file. Every test in
the framework must follow this pattern:

```java
// src/test/java/tests/UserTests.java

public class UserTests extends BaseTest {

    @Test(description = "GET /users — should return list of users with status 200")
    @Story("User Management")
    @Severity(SeverityLevel.CRITICAL)
    public void getAllUsers_shouldReturn200() {
        Response response = UserApiHelper.getAllUsers(requestSpec);

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getList("data")).isNotEmpty();
    }

    @Test(dataProvider = "userDataFromExcel", dataProviderClass = ExcelDataProvider.class,
          description = "POST /users — creates a new user with data from Excel")
    @Story("User Management")
    @Severity(SeverityLevel.NORMAL)
    public void createUser_withExcelData_shouldReturn201(String name, String job) {
        UserRequest body = new UserRequest(name, job);
        Response response = UserApiHelper.createUser(requestSpec, body);

        assertThat(response.statusCode()).isEqualTo(201);
        assertThat(response.jsonPath().getString("name")).isEqualTo(name);
    }
}
```

---

### P — Parameters

- All generated code must compile against Java 17 and Rest Assured 5.x without
  modification.
- Every assertion must use AssertJ (`assertThat(...)`) — do not use TestNG's
  built-in `Assert` class.
- Every Rest Assured helper method must carry an Allure `@Step("...")` annotation.
- The `pom.xml` must pin exact versions for every dependency — no version ranges.
- If any feature cannot be implemented with the stated stack, respond exactly:
  `"Insufficient information to determine."` and explain the gap.
- If any design decision is an inference (e.g., folder naming convention), label
  it: `"Inference (low confidence): <reason>"` and offer an alternative.
- Do not invent API endpoints, response fields, or error codes beyond what
  `https://reqres.in` documents.
- Do not assume TestNG XML suite structure — generate a `testng.xml` and
  `testng-smoke.xml` explicitly.

---

### O — Output

- **Format:** File-by-file Markdown, each file in its own fenced code block
  with the language tag set correctly (e.g., ` ```java `, ` ```xml `, ` ```yaml `).
- **Order:** Folder tree → config → base → utils → models → api helpers →
  tests → resources → pom.xml → testng XMLs → GitHub Actions YAML → README.md
- **Per-file structure:**
  1. `### <relative file path>` heading
  2. Fenced code block with full file content
  3. "Why this file exists" paragraph (2–4 sentences, plain English)
- **Final deliverable checklist:** After the README, print a checklist of all
  files generated so the engineer can verify nothing is missing.

---

### T — Tone

Fully narrated and educational. Write as a senior engineer pair-programming with
a mid-level QA engineer — explain the *why* behind each architectural choice in
plain English, not just the *what*. Use a confident, direct teaching voice.
Avoid jargon without explanation. Short section intros (1–2 sentences) before
each layer are encouraged to signal what's coming and why it matters.
```
