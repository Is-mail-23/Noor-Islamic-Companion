import re

with open('src/components/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Add prop
content = content.replace("export const AdminDashboard: React.FC = () => {", "interface AdminDashboardProps {\n  userRole: string;\n}\n\nexport const AdminDashboard: React.FC<AdminDashboardProps> = ({ userRole }) => {")

# If not admin, show login prompt
return_html = """
  if (userRole !== 'admin') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fadeIn flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-text-primary font-serif-title text-center mb-2">Access Denied</h2>
        <p className="text-text-secondary text-center max-w-md mb-6">
          You must be an App Administrator to view the Global Dashboard. Regular users can still manage their local mosques using the Mosque Pins on the map.
        </p>
        <p className="text-sm text-text-secondary text-center max-w-md">
          To switch to Admin Mode, go to your <b>Profile</b> page and tap the red "Make Me Admin" button next to your role.
        </p>
      </div>
    );
  }
"""

content = content.replace("return (", return_html + "\n  return (", 1)

with open('src/components/AdminDashboard.tsx', 'w') as f:
    f.write(content)
