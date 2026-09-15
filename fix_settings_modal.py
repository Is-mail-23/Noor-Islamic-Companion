import re

with open('src/components/SettingsModal.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">',
    '<div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm overflow-y-auto">\n      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">'
)

# Replace the closing tag. 
# Originally it was:
#           </div>
#         </motion.div>
#       </div>
#     </AnimatePresence>
content = content.replace(
    '</motion.div>\n      </div>\n    </AnimatePresence>',
    '</motion.div>\n        </div>\n      </div>\n    </AnimatePresence>'
)

with open('src/components/SettingsModal.tsx', 'w') as f:
    f.write(content)
