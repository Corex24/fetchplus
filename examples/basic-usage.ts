import { FetchPlus } from "../src/index";
import { FetchPlusError } from "../src/core/error";

/**
 * FetchPlus Basic Usage Examples
 * Simple, practical use cases
 */

// 1. SIMPLE GET REQUEST

async function basicGet() {
  try {
    const response = await FetchPlus.get(
      "https://jsonplaceholder.typicode.com/users/1",
    );
    console.log("✓ User:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Failed to fetch user:", err.message);
  }
}

// 2. GET WITH QUERY PARAMETERS

async function getWithParams() {
  try {
    const response = await FetchPlus.get(
      "https://jsonplaceholder.typicode.com/posts",
      { query: { userId: 1, _limit: 5 } },
    );
    console.log("✓ Posts:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Failed to fetch posts:", err.message);
  }
}

// 3. POST REQUEST

async function createUser() {
  try {
    const response = await FetchPlus.post(
      "https://jsonplaceholder.typicode.com/users",
      {
        body: {
          name: "John Doe",
          email: "john@example.com",
        },
      },
    );
    console.log("✓ Created:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Failed to create user:", err.message);
  }
}

// 4. WITH RETRIES & TIMEOUT

async function requestWithRetry() {
  try {
    const response = await FetchPlus.get(
      "https://jsonplaceholder.typicode.com/users/1",
      {
        retries: 3, // Retry 3 times on failure
        timeout: 5000, // Timeout after 5 seconds
      },
    );
    console.log("✓ Data:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Request failed after retries:", err.message);
  }
}

// 5. WITH CUSTOM HEADERS

async function withCustomHeaders() {
  try {
    const response = await FetchPlus.get("https://api.example.com/data", {
      headers: {
        Authorization: "Bearer YOUR_TOKEN",
        "X-Custom-Header": "value",
      },
    });
    console.log("✓ Secure data:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Failed to fetch secure data:", err.message);
  }
}

// 6. PUT/PATCH REQUEST

async function updateUser() {
  try {
    const response = await FetchPlus.put(
      "https://jsonplaceholder.typicode.com/users/1",
      {
        body: { name: "Jane Doe" },
      },
    );
    console.log("✓ Updated:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Failed to update:", err.message);
  }
}

// 7. DELETE REQUEST
async function deleteUser() {
  try {
    const response = await FetchPlus.delete(
      "https://jsonplaceholder.typicode.com/users/1",
    );
    console.log("✓ Deleted:", response);
  } catch (error) {
    const err = error as FetchPlusError;
    console.error("✗ Failed to delete:", err.message);
  }
}

// 8. ERROR HANDLING
async function errorHandling() {
  try {
    const response = await FetchPlus.get(
      "https://jsonplaceholder.typicode.com/invalid",
    );
  } catch (error) {
    if (error instanceof FetchPlusError) {
      console.log("✓ Error Status:", error.status); // 404
      console.log("✓ Error URL:", error.url); // /invalid
      console.log("✓ Error Method:", error.method); // GET
      console.log("✓ Error Code:", error.code); // error code
      console.log("✓ Error Message:", error.message); // error message
    }
  }
}

// RUN EXAMPLES
async function runExamples() {
  console.log("=== FetchPlus Usage Examples ===\n");

  console.log("1. Basic GET:");
  await basicGet();

  console.log("\n2. GET with query params:");
  await getWithParams();

  console.log("\n3. POST request:");
  await createUser();

  console.log("\n4. With retry & timeout:");
  await requestWithRetry();

  console.log("\n5. With custom headers:");
  await withCustomHeaders();

  console.log("\n6. PUT request:");
  await updateUser();

  console.log("\n7. DELETE request:");
  await deleteUser();

  console.log("\n8. Error handling:");
  await errorHandling();
}

runExamples().catch(console.error);
