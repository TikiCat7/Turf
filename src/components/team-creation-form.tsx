'use client'

import { useOrganizationList, useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { ToastAction } from './ui/toast'
import { useToast } from './ui/use-toast'

const socialsEnumType = z.enum([
  'facebook',
  'instagram',
  'twitter',
  'youtube',
  'twitch',
  'tiktok',
  'snapchat',
  'linkedin',
  'pinterest',
  'tumblr',
  'reddit',
  'discord',
  'whatsapp',
  'telegram',
  'signal',
  'wechat',
  'line',
  'viber',
  'kakaotalk',
  'wechat',
  'line',
  'viber',
  'kakaotalk',
])

const teamSocials = z.object({
  type: socialsEnumType,
  url: z.string().min(2).max(50),
})

const formSchema = z.object({
  teamName: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  country: z.string().min(2).max(50),
  teamType: z.enum([
    'club team',
    'recreational',
    'youth club 6-12',
    'youth club 12-18',
    'elementary school team',
    'middle school team',
    'high school team',
    'university team',
  ]),
  logoUrl: z.string().optional(),
  socials: z.array(teamSocials).optional(),
  website: z.string().optional(),
  phoneNumber: z.string().optional(),
})

export default function TeamCreationForm({
  closeForm,
}: {
  closeForm: () => void
}) {
  const user = useUser()
  const { toast } = useToast()
  const org = useOrganizationList()
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('going to create org')
    try {
      if (!user.user) throw new Error('no user')

      const res = await fetch('/api/create-team', {
        body: JSON.stringify(values),
        method: 'POST',
      })

      console.log('created org on clerk')
      console.log('res', res.status)
      const data = await res.json()
      console.log(data)

      if (res.status !== 200) {
        if (data.error.status === 422) {
          throw new Error(
            'A team with that name already exists. Please try another team name.'
          )
        }
        throw new Error(data.error.errors[0].message)
      }
      console.log('result: ', data)
      closeForm()
      org.setActive!({ organization: data.orgId })
      toast({
        title: 'Team Created Successfully',
        description: `${values.teamName} was created!`,
        action: (
          <ToastAction altText="go_to_gallery">
            <Link href="/team">Go to team page</Link>
          </ToastAction>
        ),
      })
      router.refresh()
    } catch (e: any) {
      console.log(e)
      toast({
        title: 'Team Creation Failed',
        description: e.message,
      })
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: '',
      description: '',
      country: '',
      logoUrl: '',
      website: '',
      phoneNumber: '',
      teamType: 'club team',
      socials: [{ url: 'https://www.teaminstagram.com', type: 'instagram' }],
    },
  })

  // const { fields, append, remove } = useFieldArray({
  //   name: 'socials',
  //   control: form.control,
  // })
  return (
    <DialogContent className={'overflow-y-scroll h-[58%]'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
            <DialogDescription>
              Create a new team for your football group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`teamType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Type</FormLabel>
                  <Select
                    {...form}
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="club team">club team</SelectItem>
                      <SelectItem value="recreational">recreational</SelectItem>
                      <SelectItem value="youth club 6-12">
                        Youth 6-12
                      </SelectItem>
                      <SelectItem value="youth club 12-18">
                        Youth 12-18
                      </SelectItem>
                      <SelectItem value="elementary school team">
                        elementary school team
                      </SelectItem>
                      <SelectItem value="middle school team">
                        middle school team
                      </SelectItem>
                      <SelectItem value="high school team">
                        high school team
                      </SelectItem>
                      <SelectItem value="university team">
                        university team
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField */}
            {/*   control={form.control} */}
            {/*   name="website" */}
            {/*   render={({ field }) => ( */}
            {/*     <FormItem> */}
            {/*       <FormLabel>Website</FormLabel> */}
            {/*       <FormControl> */}
            {/*         <Input placeholder="website" {...field} /> */}
            {/*       </FormControl> */}
            {/*       <FormMessage /> */}
            {/*     </FormItem> */}
            {/*   )} */}
            {/* /> */}
            {/* <FormField */}
            {/*   control={form.control} */}
            {/*   name="phoneNumber" */}
            {/*   render={({ field }) => ( */}
            {/*     <FormItem> */}
            {/*       <FormLabel>Organizer Mobile Number</FormLabel> */}
            {/*       <FormControl> */}
            {/*         <Input */}
            {/*           placeholder="mobile number" */}
            {/*           type="number" */}
            {/*           {...field} */}
            {/*         /> */}
            {/*       </FormControl> */}
            {/*       <FormMessage /> */}
            {/*     </FormItem> */}
            {/*   )} */}
            {/* /> */}
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Url</FormLabel>
                  <FormControl>
                    <Input placeholder="logo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* {fields.map((field, index) => { */}
            {/*   return ( */}
            {/*     <div key={index}> */}
            {/*       <FormField */}
            {/*         control={form.control} */}
            {/*         name={`socials.${index}.url`} */}
            {/*         render={({ field }) => ( */}
            {/*           <FormItem> */}
            {/*             <FormLabel>Social URL</FormLabel> */}
            {/*             <FormControl> */}
            {/*               <Input */}
            {/*                 {...form.register(`socials.${index}.url` as const)} */}
            {/*                 placeholder="Enter socials URL..." */}
            {/*                 defaultValue={field.value.toString()} */}
            {/*               /> */}
            {/*             </FormControl> */}
            {/*             <FormMessage /> */}
            {/*           </FormItem> */}
            {/*         )} */}
            {/*       ></FormField> */}
            {/**/}
            {/*       <FormField */}
            {/*         control={form.control} */}
            {/*         name={`socials.${index}.type`} */}
            {/*         render={({ field }) => ( */}
            {/*           <> */}
            {/*             <FormItem> */}
            {/*               <FormLabel>Socials Type</FormLabel> */}
            {/*               <Select */}
            {/*                 {...form.register(`socials.${index}.type` as const)} */}
            {/*                 onValueChange={field.onChange} */}
            {/*                 defaultValue={field.value.toString()} */}
            {/*               > */}
            {/*                 <FormControl> */}
            {/*                   <SelectTrigger> */}
            {/*                     <SelectValue placeholder="instagram" /> */}
            {/*                   </SelectTrigger> */}
            {/*                 </FormControl> */}
            {/**/}
            {/*                 <SelectContent> */}
            {/*                   <SelectItem value="instagram"> */}
            {/*                     instagram */}
            {/*                   </SelectItem> */}
            {/*                   <SelectItem value="facebook">facebook</SelectItem> */}
            {/*                   <SelectItem value="whatsapp">whatsapp</SelectItem> */}
            {/*                 </SelectContent> */}
            {/*               </Select> */}
            {/*               <FormMessage /> */}
            {/*             </FormItem> */}
            {/*           </> */}
            {/*         )} */}
            {/*       /> */}
            {/*       {fields.length > 1 && ( */}
            {/*         <Button onClick={() => remove(index)} className="mt-2"> */}
            {/*           Delete */}
            {/*         </Button> */}
            {/*       )} */}
            {/*     </div> */}
            {/*   ) */}
            {/* })} */}
            {/* <Button */}
            {/*   onClick={() => */}
            {/*     append({ */}
            {/*       type: 'whatsapp', */}
            {/*       url: 'social URL', */}
            {/*     }) */}
            {/*   } */}
            {/* > */}
            {/*   Add Socials */}
            {/* </Button> */}
          </div>
          <DialogFooter>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
