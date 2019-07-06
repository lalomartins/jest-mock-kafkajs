'use strict';

const KafkaConnection = require('../src/kafka-connection');
const { initConfig, topic, groupId } = require('../src/config');

describe('test KafkaConnection with the mocked kafkajs module', () => {
  test('should produce and consume successfully', async (done) => {
    const kafkaConnection = new KafkaConnection(initConfig);
    const key = 'key1';
    const value = 'value1';

    const onEachMessage = async ({ message }) => {
      console.log('getting message from Kafka');
      expect(message.key.toString()).toBe(key);
      expect(message.value.toString()).toBe(value);
      await kafkaConnection.disconnect();
      done();
    };

    await kafkaConnection.setupSubscription({ groupId, topic, onEachMessage });

    await kafkaConnection.sendMessage({
      topic,
      messages: [
        {
          key,
          value,
        },
      ],
    });
  }, 10000);
});