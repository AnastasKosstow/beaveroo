"""Curious Otter — Python for .NET Developers, Unit 00.

Run from the folder that contains this file:

    python main.py        # Windows (also: py main.py)
    python3 main.py       # macOS / Linux

Expected output:

    Hello, Curious Otter!
"""


def greet(name: str) -> str:
    return f"Hello, {name}!"


if __name__ == "__main__":
    print(greet("Curious Otter"))
