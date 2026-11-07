def describe(name: str, version: int) -> str:
    # В C# "Python " + 3 вика ToString(). А в Python?
    return "Python " + version + " for " + name


if __name__ == "__main__":
    print(describe("Curious Otter", 3))
