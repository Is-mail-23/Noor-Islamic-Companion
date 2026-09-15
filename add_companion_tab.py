import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if 'AICompanion' not in content:
    content = content.replace("import { AdminDashboard } from './components/AdminDashboard';", 
    "import { AdminDashboard } from './components/AdminDashboard';\nimport { AICompanion } from './components/AICompanion';")

# Add the route in App.tsx
if "activeTab === 'ai_companion'" not in content:
    route_jsx = """
          {activeTab === 'ai_companion' && (
            <motion.div
              key="ai-companion-tab"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <AICompanion />
            </motion.div>
          )}
"""
    # Insert it right before </AnimatePresence>
    content = content.replace("        </AnimatePresence>", route_jsx + "        </AnimatePresence>")

with open('src/App.tsx', 'w') as f:
    f.write(content)

