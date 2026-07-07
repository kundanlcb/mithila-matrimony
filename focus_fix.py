import re

path = 'src/components/RegistrationChat.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add inputRef and useEffect after line 32 (welcomeTriggered)
# Actually, I'll insert it after `const [errorMsg, setErrorMsg] = useState<string | null>(null);`

insert_text = """
  const inputRef = useRef<any>(null);
  const isDisabled = typing || (messages.length > 0 && messages[messages.length - 1].sender === 'bot' && messages[messages.length - 1].inputType !== 'text');

  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [isDisabled]);
"""

content = re.sub(
    r"(const \[errorMsg, setErrorMsg\] = useState<string \| null>\(null\);)",
    r"\1\n" + insert_text,
    content
)

# Remove the old `const isDisabled = ...` definition around line 990
content = re.sub(
    r"const isDisabled = typing \|\| \(messages\.length > 0 && messages\[messages\.length - 1\]\.sender === 'bot' && messages\[messages\.length - 1\]\.inputType !== 'text'\);\s*",
    "",
    content
)

# Add ref={inputRef} to the textarea
content = re.sub(
    r"(<textarea\s+rows=\{1\}\s+placeholder=\{placeholderText\})",
    r"\1\n                ref={inputRef}",
    content
)

# Add ref={inputRef} to the input
content = re.sub(
    r"(<input\s+type=\{type\}\s+placeholder=\{placeholderText\})",
    r"\1\n                ref={inputRef}",
    content
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("RegistrationChat.tsx updated successfully with auto-focus.")
