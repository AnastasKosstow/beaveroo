def describe(name: str, version: int) -> str:
    # In C#, "Python " + 3 calls ToString(). In Python?
    return "Python " + version + " for " + name


if __name__ == "__main__":
    print(describe("Curious Otter", 3))
