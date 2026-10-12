import React from 'react'
import {Attachment,AttachmentContent,AttachmentTitle,AttachmentDescription} from './registry/new-york-v4/ui/attachment'
import {Bubble,BubbleContent,BubbleGroup} from './registry/new-york-v4/ui/bubble'
import {Message,MessageContent,MessageHeader,MessageFooter} from './registry/new-york-v4/ui/message'
import {Marker,MarkerContent} from './registry/new-york-v4/ui/marker'
import {DirectionProvider} from './registry/new-york-v4/ui/direction'
import {Combobox,ComboboxInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty} from './registry/new-york-v4/ui/combobox'
import {MessageScrollerProvider,MessageScroller,MessageScrollerViewport,MessageScrollerContent,MessageScrollerItem} from './registry/new-york-v4/ui/message-scroller'
import {Button} from './registry/new-york-v4/ui/button'
import {toast} from 'sonner'
export function AttachmentPreview(){return <Attachment><AttachmentContent><AttachmentTitle>Project brief.pdf</AttachmentTitle><AttachmentDescription>PDF · Sample attachment</AttachmentDescription></AttachmentContent></Attachment>}
export function BubblePreview(){return <BubbleGroup><Bubble variant="secondary"><BubbleContent>Can you share the next step?</BubbleContent></Bubble><Bubble align="end"><BubbleContent>Your checklist is ready to review.</BubbleContent></Bubble></BubbleGroup>}
export function MessagePreview(){return <Message><MessageContent><MessageHeader>Project team · Demo</MessageHeader><Bubble variant="secondary"><BubbleContent>All the information, in one place.</BubbleContent></Bubble><MessageFooter>Just now</MessageFooter></MessageContent></Message>}
export function MarkerPreview(){return <div className="grid gap-6 w-full"><Marker variant="separator"><MarkerContent>Today</MarkerContent></Marker><Marker variant="border"><MarkerContent>New activity</MarkerContent></Marker></div>}
export function DirectionPreview(){return <DirectionProvider dir="rtl"><div dir="rtl" className="flex gap-2"><Button>التالي</Button><Button variant="outline">السابق</Button></div></DirectionProvider>}
export function ComboboxPreview(){const items=['Overview','Documents','Activity'];return <Combobox items={items}><ComboboxInput placeholder="Choose a view"/><ComboboxContent><ComboboxEmpty>No results.</ComboboxEmpty><ComboboxList>{(item:string)=><ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList></ComboboxContent></Combobox>}
export function ScrollerPreview(){return <div className="h-48 w-full"><MessageScrollerProvider><MessageScroller><MessageScrollerViewport><MessageScrollerContent>{Array.from({length:8},(_,i)=><MessageScrollerItem key={i}><Bubble variant="secondary"><BubbleContent>Demo activity {i+1}</BubbleContent></Bubble></MessageScrollerItem>)}</MessageScrollerContent></MessageScrollerViewport></MessageScroller></MessageScrollerProvider></div>}
export function SonnerPreview(){return <Button onClick={()=>toast.success('Preview notification',{description:'This is a local demo. Nothing was submitted.'})}>Show notification</Button>}
import {useForm} from 'react-hook-form'
import {Form,FormField,FormItem,FormLabel,FormControl,FormDescription} from './registry/new-york-v4/ui/form'
import {Input} from './registry/new-york-v4/ui/input'
export function FormPreview(){const form=useForm({defaultValues:{project:''}});return <Form {...form}><form className="w-full max-w-xs grid gap-4" onSubmit={form.handleSubmit(()=>toast('Demo form: no data submitted'))}><FormField control={form.control} name="project" render={({field})=><FormItem><FormLabel>Project name</FormLabel><FormControl><Input placeholder="Your next project" {...field}/></FormControl><FormDescription>A reusable form with accessible fields.</FormDescription></FormItem>}/><Button type="submit">Continue</Button></form></Form>}
