import { LiveObject, Spec, Property, Call, OnCall, Address, BigInt, saveAll } from '@spec.dev/core'

/**
 * The recipients of a split contract.
 */
@Spec({ 
    uniqueBy: ['address', 'splitAddress', 'chainId']
})
class Recipient extends LiveObject {
    // Address of the recipient.
    @Property()
    address: Address

    // Address of the split contract.
    @Property()
    splitAddress: Address

    // Allocation of the split.
    @Property()
    allocation: BigInt

    // ==== Call Handlers ===================

    @OnCall('0xsplits.SplitMain.createSplit')
    async onCreateSplit(call: Call) {
        const splitAddress = call.outputs.split
        const recipientAddresses = call.inputs.accounts || []
        const allocations = call.inputs.percentAllocations || []
        
        await saveAll(...recipientAddresses.map((address, i) => (
            this.new(Recipient, {
                address,
                splitAddress,
                allocation: BigInt.from(allocations[i]),
            }))
        ))
    }
}

export default Recipient