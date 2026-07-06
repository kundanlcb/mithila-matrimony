import re
import sys

with open('src/components/RegistrationChat.tsx', 'r') as f:
    content = f.read()

switch_regex = re.compile(r'    switch \(currentStep\) \{.*?(?=  \/\/ Hobbies tags selectors handler)', re.DOTALL)
m = switch_regex.search(content)
if not m:
    print("Not found")
    sys.exit(1)

# Read the replacement from another file to avoid escaping issues
with open('new_switch.txt', 'r') as f:
    new_logic = f.read()

content = content[:m.start()] + new_logic + content[m.end():]

with open('src/components/RegistrationChat.tsx', 'w') as f:
    f.write(content)
print("Done")
