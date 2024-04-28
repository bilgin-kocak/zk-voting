'use client';
import { Button } from '@/components/button/Button';
import Candidates from '../_components/candidates/candidates';
import styles from './page.module.scss';
import cn from 'classnames';
import { useState, useEffect } from 'react';
import {
  Container,
  TextArea,
  Box,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import EducationalResources from '@/components/educational-resources/EducationalResources';

export default function EducationalResourcesPage() {
  return (
    <div className={styles.page}>
      <EducationalResources />
    </div>
  );
}
