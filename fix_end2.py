import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    marker = "Update 5 Waqt Times (Admin Portal)\n            </button>\n          </div>"
    if marker in content:
        before, after = content.split(marker, 1)
        new_after = "\n      </div>\n    </div>\n  </div>\n</div>\n  );\n};\n"
        with open(filepath, 'w') as f:
            f.write(before + marker + new_after)

fix_file('src/components/MasjidProfileModal.tsx')
fix_file('src/components/MasjidAdminModal.tsx')

def fix_allocate(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    marker = "Allocate Mosque to Map\n            </button>\n          </div>\n        </form>\n      </div>"
    if marker in content:
        before, after = content.split(marker, 1)
        new_after = "\n    </div>\n  </div>\n</div>\n  );\n};\n"
        with open(filepath, 'w') as f:
            f.write(before + marker + new_after)

fix_allocate('src/components/AllocateMasjidModal.tsx')

