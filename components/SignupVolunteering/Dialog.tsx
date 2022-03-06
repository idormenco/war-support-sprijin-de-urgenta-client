import { DonateVolunteeringRequest } from 'api'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { MultiSelectOption } from '../Form/types'
import Input from '@/components/Form/Input'
import Textarea from '@/components/Form/Textarea'
import clsx from 'clsx'
import DateInput from '@/components/Form/Date'
import DropdownMultiSelect from '@/components/Form/DropdownMultiSelect'
import { useTranslation } from 'react-i18next'
import Button from '@/components/Button'
import { yupResolver } from '@hookform/resolvers/yup'
import { SchemaOf } from 'yup'
import * as yup from 'yup'

interface IProps {
  counties: MultiSelectOption[]
  category: number
  onSubmit: (values: DonateVolunteeringRequest) => void
}

type VolunteeringResourceForm = {
  name: string
  category: number
  town?: string
  description?: string
  available_until?: string
  county_coverage: string[]
}

const Dialog: FC<IProps> = ({ counties, category, onSubmit }) => {
  const { t } = useTranslation()
  const volunteeringResourcesSchema: SchemaOf<VolunteeringResourceForm> = yup.object()
    .shape({
      name: yup.string().required(t('error.name.required')),
      category: yup.number().typeError(t('error.must.be.number')).required(t('error.type.required')),
      town: yup.string().typeError(t('error.must.be.string')),
      description: yup.string().typeError(t('error.must.be.string')),
      available_until: yup.string().typeError(t('error.must.be.string')),
      county_coverage: yup
        .array()
        .min(1, t('error.county.minOne'))
        .of(yup.string().required()),
    })

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<VolunteeringResourceForm>({
    resolver: yupResolver(volunteeringResourcesSchema),
    reValidateMode: 'onSubmit',
    mode: 'all',
    defaultValues: {
      county_coverage: [],
      available_until: (new Date()).toISOString().split('T')[0],
      category
    }
  })

  const onFormSubmit = (values: VolunteeringResourceForm) => {
    const donateOtherRequest: DonateVolunteeringRequest = { ...values, type: category }
    onSubmit(donateOtherRequest)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <Input
        label={t('signup.volunteering.name')}
        {...register('name')}
        errors={errors.name}
      />
      <div className={'flex space-x-4'}>
        <DropdownMultiSelect
          {...register('county_coverage')}
          className={clsx('w-1/2 mb-4')}
          options={counties || []}
          errors={errors['county_coverage']}
          control={control}
          label={t('signup.other.county_coverage')}
        />
        <Input label={t('signup.volunteering.town')} {...register('town')} />
      </div>
      <Textarea
        label={t('signup.volunteering.description')}
        {...register('description')}
      />
      <DateInput
        label={t('signup.volunteering.available_until')}
        {...register('available_until')}
      />
      <Button type="submit" text={t('add')} variant="tertiary" size="small" />
    </form>
  )
}

export default Dialog