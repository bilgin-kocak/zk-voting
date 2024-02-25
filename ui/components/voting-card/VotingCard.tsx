import { useEffect } from 'react';
import cn from 'classnames';
import { Card, Flex, Avatar, Box, Text } from '@radix-ui/themes';

export function VotingCard({ voteName = '', voteDescription = '' }) {
  return (
    <>
      <Card style={{ maxWidth: 500 }}>
        <a href="#">
          <Flex gap="3" align="center">
            <Avatar
              size="3"
              //   src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
              radius="full"
              fallback="V"
            />
            <Box>
              <Text as="div" size="2" weight="bold">
                {voteName}
              </Text>
              <Text as="div" size="2" color="gray">
                {voteDescription}
              </Text>
            </Box>
          </Flex>
        </a>
      </Card>
    </>
  );
}
