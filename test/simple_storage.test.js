const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", () => {
  it("should deploy successfully", async () => {
    const instance = await SimpleStorage.deployed();

    assert.isTrue(instance.address !== "0x0000000000000000000000000000000000000000");
  });

  it("should store and retrieve a value", async () => {
    const instance = await SimpleStorage.deployed();

    await instance.set(42);

    const storedValue = await instance.get();
    assert.equal(storedValue.toString(), "42");
  });
});