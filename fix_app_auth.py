import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Add import
if 'AuthModal' not in content:
    content = content.replace("import { SettingsModal } from './components/SettingsModal';", "import { SettingsModal } from './components/SettingsModal';\nimport { AuthModal } from './components/AuthModal';")

# Add State for AuthModal
if 'isAuthOpen' not in content:
    content = content.replace("const [isAllocateOpen, setIsAllocateOpen] = useState(false);", "const [isAllocateOpen, setIsAllocateOpen] = useState(false);\n  const [isAuthOpen, setIsAuthOpen] = useState(false);")

# Change onSignIn prop in Navbar
content = content.replace('onSignIn={handleSignIn}', 'onSignIn={() => setIsAuthOpen(true)}')

# Add AuthModal component next to SettingsModal
auth_modal_comp = """
      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignIn={async (role, code) => {
          await signInWithGoogle(role, code);
          setIsAuthOpen(false);
        }}
      />
"""

content = content.replace('<SettingsModal', auth_modal_comp + '<SettingsModal')

with open('src/App.tsx', 'w') as f:
    f.write(content)
