import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

# Replace getFirestore with initializeFirestore
content = content.replace("import { getFirestore", "import { getFirestore, initializeFirestore")

# Replace const db = getFirestore(app, config.firestoreDatabaseId);
# with initializeFirestore
content = content.replace(
    "const db = getFirestore(app, config.firestoreDatabaseId); // Use specific database ID if provided in config",
    "const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);"
)
content = content.replace(
    "const db = getFirestore(app, config.firestoreDatabaseId);",
    "const db = initializeFirestore(app, { experimentalForceLongPolling: true }, config.firestoreDatabaseId);"
)


with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)
