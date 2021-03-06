import React, {useState, useEffect} from 'react'
import {CalendarIcon, ClockIcon, LinkIcon, PlaceholderIcon} from '../Icons'
import styled from 'styled-components'
import {getHumanDate, sortDate} from '../../utils/date'
import {SortDate} from '../../utils/date'

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-flow: row wrap;
  margin-left: -15px;
`
const Item = styled.li`
  width: 50%;
  display: flex;
  @media (max-width: 666px) {
    width: 100%;
  }
`
const ItemInner = styled.div`
  background-color: #fff;
  margin-bottom: 15px;
  border-radius: 3px;
  padding: 15px;
  padding-bottom: 5px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 100%;
  margin-left: 15px;
`
const Name = styled.a`
  display: block;
  margin-bottom: 10px;
  line-height: 1;
  font-family: Helvetica;
  font-size: 28px;
  color: #e15345;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  padding-right: 37px;
  span {
    margin-left: 10px;
  }
  &:nth-child(3) {
    padding-right: 0;
  }
`
const Link = styled.a`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
`

type Range = {
  start: string
  end: string
}

interface Entries {
  name: string
  location: {
    city: string
    country: string
  }
  date: Range
  time?: Range
}

interface Select {
  value: string
  lavel: string
}

type Props = {
  country: Select[]
  city: Select[]
  entries: Entries[]
}
function Events(props: Props) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const {entries, country, city} = props
    let list = filterEvents(entries, country, 'country')
    if (city.length && country.length) {
      list = filterEvents(list, city, 'city')
    }

    setEvents(list)
  })

  function filterEvents(arr: Entries[], selected: Select[] = [], type: string = 'city') {
    if (!selected.length) return arr
    let list: any = []
    selected.map(({value}) => {
      const find = arr.filter((item: any) => {
        if (type && value) {
          return item.location[type].toLowerCase().search(value.toLowerCase()) !== -1
        }
        return item
      })
      return find.map((item: any) => {
        return list.push(item)
      })
    })

    list.sort((eventA: SortDate, eventB: SortDate) => {
      return sortDate(eventA, eventB)
    })

    return list
  }

  return (
    <List>
      {events.map((el: any, key: any) => (
        <Item key={key}>
          <ItemInner>
            <Name target="_blank" rel="noopener" href={el.link}>
              {el.name}
            </Name>
            <Row>
              <PlaceholderIcon />
              <span>
                {el.location.city}, {el.location.country}
              </span>
            </Row>
            <Row>
              <CalendarIcon />
              <span>
                {getHumanDate(el.date.start)}
                {el.date.end ? ` — ${getHumanDate(el.date.end)}` : ''}
              </span>
            </Row>
            {el.time.start ? (
              <Row>
                <ClockIcon />
                <span>
                  {el.time.start}
                  {el.time.end ? ` — ${el.time.end}` : ''}
                </span>
              </Row>
            ) : (
              ''
            )}

            <Link target="_blank" title={el.name} rel="noopener" href={el.link}>
              <LinkIcon />
            </Link>
          </ItemInner>
        </Item>
      ))}
    </List>
  )
}
class Events1 extends React.Component<any, any> {
  state = {
    events: [],
  }
  constructor(props: any) {
    super(props)
  }
  componentDidMount() {
    this.updateEvents(this.props)
  }

  componentWillReceiveProps = (nextProps: any) => {
    this.updateEvents(nextProps)
  }

  updateEvents = (props: any) => {
    const {entries, country, city} = props || this.props
    let list = this.filterEvents(entries, country, 'country')
    if (city.length && country.length) {
      list = this.filterEvents(list, city, 'city')
    }

    this.setState({
      events: list,
    })
  }

  filterEvents = (arr: any, selected = [], type = 'city') => {
    if (!selected.length) return arr
    let list: any = []
    selected.map(({value}: {value?: string}) => {
      const find = arr.filter((item: any) => {
        if (type && value) {
          return item.location[type].toLowerCase().search(value.toLowerCase()) !== -1
        }
        return item
      })
      return find.map((item: any) => {
        return list.push(item)
      })
    })

    list.sort((eventA: any, eventB: any) => {
      return sortDate(eventA, eventB)
    })

    return list
  }

  render() {
    const {events} = this.state
    return (
      <List>
        {events.map((el: any, key: any) => (
          <Item key={key}>
            <ItemInner>
              <Name target="_blank" rel="noopener" href={el.link}>
                {el.name}
              </Name>
              <Row>
                <PlaceholderIcon />
                <span>
                  {el.location.city}, {el.location.country}
                </span>
              </Row>
              <Row>
                <CalendarIcon />
                <span>
                  {getHumanDate(el.date.start)}
                  {el.date.end ? ` — ${getHumanDate(el.date.end)}` : ''}
                </span>
              </Row>
              {el.time.start ? (
                <Row>
                  <ClockIcon />
                  <span>
                    {el.time.start}
                    {el.time.end ? ` — ${el.time.end}` : ''}
                  </span>
                </Row>
              ) : (
                ''
              )}

              <Link target="_blank" title={el.name} rel="noopener" href={el.link}>
                <LinkIcon />
              </Link>
            </ItemInner>
          </Item>
        ))}
      </List>
    )
  }
}

export default Events
