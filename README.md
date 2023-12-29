# zk-voting app

You can follow installation and deployment of zkapp in [here](https://github.com/bilgin-kocak/zk-voting/blob/main/contracts/README.md#mina-zkapp-04-zkapp-browser-ui)

We have deployed our smart contract on Berkeley Testnet. You can see the transaction [here](https://minascan.io/berkeley/tx/5Jv6J6E6zCubst46cRV9JBPnqpLBXRVSL9f5U3amY7PaxmwEjmFK?type=zk-tx)
![image](https://user-images.githubusercontent.com/30844607/282258834-917d6eca-2f5f-4276-8302-7dbc5bcd2600.png)

We plan to prepare a frontend for our zkapp, we encounter some issues using Berkeley Testnet. For now you can ignore ui folder.

You can find presentation and demo usage of zk-woting [here](https://www.canva.com/design/DAFz25aDDxM/ZBTmh2Tg1Hb3F4BLIucvBw/edit?utm_content=DAFz25aDDxM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Overview

Our Secure Voting System leverages the power of the o1js library and Mina blockchain, the lightweight blockchain platform. We integrate the advanced cryptographic library **o1js** and utilize **Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge (zk-SNARKs)** to create a seamless and secure voting environment.

## Features

- 🗳️ **Anonymous Voting**: Every vote is anonymous, ensuring voter privacy.
- 🛡️ **Security with zk-SNARKs**: Votes are verified using zk-SNARKs, allowing for the validation of votes without revealing the voter's identity or choice.
- 🔒 **Double Voting Prevention**: Our system detects and prevents double voting, maintaining the integrity of the electoral process.
- 🚀 **High-Performance Voting**: With the use of the o1js library, our system is optimized for performance, handling a high volume of votes with ease.
- 📊 **Transparency and Auditability**: The Mina blockchain allows for a transparent tally without compromising voter privacy.
- 📝 **Easy Integration**: Easy to integrate with existing systems and platforms, facilitating a broad adoption for various voting needs.

## Problems Solved

- **Vote Privacy**: Protects the secrecy of the ballot, ensuring that no entity can trace the vote back to the voter.
- **Vote Manipulation**: Mitigates the risk of vote manipulation by ensuring that the vote submitted is the vote recorded.
- **Accessibility**: Offers a lightweight blockchain solution that doesn't require heavy computational resources.
- **Trust**: Builds trust in the electoral system through cryptographic proofs that ensure vote integrity and verification without disclosure.
- **Scalability**: Addresses the scalability issues commonly associated with blockchain technology, enabling the handling of large-scale elections.

For more information or to schedule a demo, please contact our project management team.

## Challenges Encountered in the Voting System Project

### Learning Curve for o1js Library

As first-time users of the **o1js library**, we encountered a steep learning curve. The library is packed with advanced features tailored to the Mina blockchain, which required dedicated time to master. To overcome this, we:

- Conducted internal workshops led by team members who first acquired expertise through documentation and practical experiments.
- Reached out to the o1js community for guidance on best practices and troubleshooting advice.

### Berkeley Blockchain Accuracy Issues

Our reliance on Berkeley's blockchain solutions was met with unexpected inaccuracies. It became evident that certain components did not perform as anticipated, affecting the accuracy of our voting system. To mitigate these issues, we:

- Implemented rigorous testing phases to identify and document the inaccuracies.
- Worked on alternative solutions while staying in communication with Berkeley's support team for patches and updates.

### Recursive Proofs Complexity

Dealing with **recursive proofs**, a new addition to our cryptographic toolkit, was particularly challenging. Recursive proofs are crucial for ensuring scalability and privacy but understanding and implementing them was not straightforward. Our approach to resolving this involved:

- Diving deep into academic papers and resources to better understand the theoretical framework.
- Applying a hands-on learning approach by starting with simple proofs and gradually increasing complexity.

### Managing Offchain Storage

Storing data off-chain presented significant difficulties, especially regarding syncing data back to the blockchain and ensuring consistency. Our steps towards a solution included:

- Establishing a strict protocol for off-chain storage interaction.
- Creating mock scenarios to test the reliability and consistency of our off-chain data before going live.

By facing these challenges head-on with a combination of education, community support, and rigorous testing, we have managed to build a robust and secure voting system. We believe that these hurdles have only strengthened our team's capabilities and our system's resilience.

### System Diagram

![image](https://user-images.githubusercontent.com/30844607/282285699-87ad5545-148f-44f4-8371-65c6091cccdb.png)

## License

[Apache-2.0](LICENSE)
